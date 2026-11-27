import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDataset } from "@/db/repository";
import { createCheckoutSession, isTestKey, minorUnits } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { SITE_URL } from "@/config/brand";

const Input = z.object({
  card: z.string().regex(/^[a-z0-9-]{2,60}$/), value: z.coerce.number().positive().max(5000),
  email: z.string().trim().toLowerCase().email(), name: z.string().trim().max(120).default(""),
  recipient: z.string().trim().max(120).default(""), message: z.string().trim().max(400).default(""),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  design: z.enum(["carmine", "garnet", "ivory"]).default("carmine"), locale: z.enum(["en", "it"]).default("en"),
});

/** Gift-card checkout. STRIPE TEST MODE ONLY: live keys are refused. No real card is charged. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`checkout:${ip}`, 8, 60_000).ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!isTestKey(key)) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const parsed = Input.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  const v = parsed.data;
  const card = (await getDataset()).giftCards.find((g) => g.slug === v.card);
  if (!card || !card.values.includes(v.value)) return NextResponse.json({ error: "unknown_card_or_value" }, { status: 400 });
  try {
    const s = await createCheckoutSession(key, {
      mode: "payment", customer_email: v.email, locale: v.locale,
      "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": card.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(minorUnits(v.value, card.currency)),
      "line_items[0][price_data][product_data][name]": `${card.name.en} (TEST)`,
      success_url: `${SITE_URL}/${v.locale}/gifts/?paid=1`, cancel_url: `${SITE_URL}/${v.locale}/gifts/`,
      "metadata[kind]": "gift-card", "metadata[card]": card.slug, "metadata[design]": v.design, "metadata[recipient]": v.recipient,
      "metadata[message]": v.message, "metadata[delivery_date]": v.delivery_date ?? "", "metadata[buyer]": v.name,
    });
    return NextResponse.json({ url: s.url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
