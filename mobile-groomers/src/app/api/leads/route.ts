import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailAddress, sendEmail } from "@/lib/email";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

/**
 * Lead capture for the "Request a Free Quote" form on a listing page.
 *
 * Reads and counts run through the service-role client, not the anonymous
 * one: `leads` deliberately has no public SELECT policy (so one visitor can
 * never read another's quote request), which also means an anonymous count
 * query silently returns zero. Rate limiting therefore only works with the
 * admin client — see the guard below.
 */

export const runtime = "nodejs";

const MAX_FIELD = 500;
/** Max leads accepted from one submitter per window, per groomer. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

function hashIp(ip: string): string {
  // Salted with a server-side secret so the hash is not a reversible
  // rainbow-table lookup over the small IPv4 space.
  const salt = process.env.LEAD_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const groomerId = clean(body.groomerId);
  const name = clean(body.name);
  const contact = clean(body.contact);
  const zipCode = clean(body.zip);
  const pet = clean(body.pet);
  const message = clean(body.message);
  // Honeypot: a real user never fills a field hidden from the layout.
  const honeypot = clean(body.company);

  if (honeypot) {
    // Silently accept so the bot does not learn it was rejected.
    return NextResponse.json({ ok: true });
  }

  if (!name || !contact) {
    return NextResponse.json(
      { error: "Name and a contact detail are required." },
      { status: 400 },
    );
  }

  if (zipCode && !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "Zip code must be five digits." },
      { status: 400 },
    );
  }

  // Demo mode: accept the lead so the UI flow stays testable, but say plainly
  // that nothing was persisted.
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, stored: false, mode: "demo" });
  }

  if (!groomerId) {
    return NextResponse.json({ error: "Unknown groomer." }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const sourceHash = hashIp(ip);

  const admin = createAdminClient();

  if (admin) {
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await admin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("groomer_id", groomerId)
      .eq("source_hash", sourceHash)
      .gte("created_at", since);

    if ((count ?? 0) >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
  }

  // Without the service-role key the insert still works under the public
  // insert policy; only rate limiting and forwarding are unavailable.
  const writer = admin ?? createPublicClient();
  if (!writer) {
    return NextResponse.json({ ok: true, stored: false, mode: "demo" });
  }

  const { data: inserted, error } = await writer
    .from("leads")
    .insert({
      groomer_id: groomerId,
      name,
      contact,
      zip_code: zipCode,
      pet,
      message,
      source_hash: sourceHash,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Could not save the request. Please try again." },
      { status: 500 },
    );
  }

  // The lead is committed at this point. Forwarding is best-effort: a mail
  // failure must never cost the business the lead, so it only affects the
  // row's status, never the response.
  let forwarded = false;
  if (admin && inserted?.id) {
    forwarded = await forwardLead({
      admin,
      leadId: inserted.id,
      groomerId,
      lead: { name, contact, zipCode, pet, message },
    });
  }

  return NextResponse.json({ ok: true, stored: true, forwarded });
}

async function forwardLead({
  admin,
  leadId,
  groomerId,
  lead,
}: {
  admin: NonNullable<ReturnType<typeof createAdminClient>>;
  leadId: string;
  groomerId: string;
  lead: { name: string; contact: string; zipCode: string; pet: string; message: string };
}): Promise<boolean> {
  const { data: groomer } = await admin
    .from("groomers")
    .select("name, email, city, state, city_slug, slug")
    .eq("id", groomerId)
    .maybeSingle();

  if (!groomer?.email) return false;

  const listingUrl = `${SITE_URL}/groomers/${groomer.city_slug}/${groomer.slug}`;
  const sent = await sendEmail({
    to: groomer.email,
    // Reply-to is the customer when they left an email, so the groomer can
    // answer straight from their inbox instead of retyping the address.
    replyTo: isEmailAddress(lead.contact) ? lead.contact : undefined,
    subject: `New quote request${lead.zipCode ? ` — ${lead.zipCode}` : ""} · ${SITE_NAME}`,
    text: [
      `You have a new quote request from your ${SITE_NAME} listing.`,
      "",
      `Name:    ${lead.name}`,
      `Contact: ${lead.contact}`,
      lead.zipCode ? `Zip:     ${lead.zipCode}` : "",
      lead.pet ? `Pet:     ${lead.pet}` : "",
      lead.message ? `\nMessage:\n${lead.message}` : "",
      "",
      "Reply to this email to reach the customer directly.",
      "",
      `Your listing: ${listingUrl}`,
      `Manage leads: ${SITE_URL}/dashboard`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (sent) {
    await admin.from("leads").update({ status: "forwarded" }).eq("id", leadId);
  }
  return sent;
}
