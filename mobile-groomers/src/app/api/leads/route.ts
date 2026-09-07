import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Lead capture for the "Request a Free Quote" form on a listing page.
 *
 * The row is written under RLS: `leads_public_insert` allows anonymous
 * inserts, and only the owning groomer can read the row back. The submitter's
 * IP is hashed rather than stored, so repeat-submission throttling works
 * without keeping raw addresses.
 */

export const runtime = "nodejs";

const MAX_FIELD = 500;
/** Max leads accepted from one IP per window, per groomer. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

function hashIp(ip: string): string {
  // Salted with a server-side secret when available so the hash is not a
  // reversible rainbow-table lookup over the small IPv4 space.
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

  // Demo mode: accept the lead so the UI flow is testable, but make it clear
  // in the response that nothing was persisted.
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, stored: false, mode: "demo" });
  }

  if (!groomerId) {
    return NextResponse.json({ error: "Unknown groomer." }, { status: 400 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, stored: false, mode: "demo" });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const sourceHash = hashIp(ip);

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await supabase
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

  const { error } = await supabase.from("leads").insert({
    groomer_id: groomerId,
    name,
    contact,
    zip_code: zipCode,
    pet,
    message,
    source_hash: sourceHash,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save the request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
