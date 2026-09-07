import { NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { TIER_PRICE_IDS, getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site-config";

export const runtime = "nodejs";

/**
 * Creates a Stripe Checkout session for a listing upgrade.
 *
 * The tier is resolved to a price ID on the server, so a client cannot name
 * its own amount. Ownership of the listing is verified before charging.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Billing is not configured yet." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const groomerId = String(body.groomerId ?? "");
  const tier = String(body.tier ?? "pro");

  const priceId = TIER_PRICE_IDS[tier];
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  // Confirm the caller owns this listing before creating a subscription.
  const { data: listing } = await supabase
    .from("groomers")
    .select("id, name, stripe_customer_id")
    .eq("id", groomerId)
    .eq("owner", user.id)
    .maybeSingle();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const stripe = getStripe()!;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: listing.stripe_customer_id ?? undefined,
    customer_email: listing.stripe_customer_id ? undefined : (user.email ?? undefined),
    success_url: `${SITE_URL}/dashboard?upgraded=1`,
    cancel_url: `${SITE_URL}/dashboard`,
    // Echoed back on the webhook so the subscription can be attributed.
    metadata: { groomer_id: listing.id, tier },
    subscription_data: { metadata: { groomer_id: listing.id, tier } },
  });

  return NextResponse.json({ url: session.url });
}
