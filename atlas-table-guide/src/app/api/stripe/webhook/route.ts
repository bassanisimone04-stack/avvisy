import { NextResponse, type NextRequest } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { supabaseService } from "@/db/supabase";

/** Stripe webhook: signature verified against STRIPE_WEBHOOK_SECRET before anything is trusted. */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const payload = await req.text();
  if (!verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret)) return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  const event = JSON.parse(payload) as { type: string; data: { object: { id: string; amount_total?: number; currency?: string; customer_email?: string; customer_details?: { email?: string }; metadata?: Record<string, string>; livemode?: boolean } } };
  if (event.type === "checkout.session.completed") {
    const o = event.data.object;
    const sb = supabaseService();
    if (!sb) return NextResponse.json({ error: "database_not_configured" }, { status: 501 });
    const { error } = await sb.from("orders").upsert({
      stripe_session_id: o.id, kind: o.metadata?.kind ?? "gift-card", amount_total: (o.amount_total ?? 0) / 100, currency: (o.currency ?? "eur").toUpperCase(),
      customer_email: o.customer_email ?? o.customer_details?.email ?? null, metadata: o.metadata ?? {}, test_mode: !o.livemode,
    }, { onConflict: "stripe_session_id" });
    if (error) { console.error("[stripe webhook]", error.message); return NextResponse.json({ error: "store_failed" }, { status: 500 }); }
  }
  return NextResponse.json({ received: true });
}
