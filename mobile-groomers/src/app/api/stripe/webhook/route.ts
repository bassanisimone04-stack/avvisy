import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe subscription webhook.
 *
 * Writes with the service-role key because there is no user session on a
 * webhook request and RLS would otherwise reject the update. The signature
 * check above is what authenticates the caller — without it this endpoint
 * would let anyone grant themselves a paid tier.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  const admin = createAdminClient();

  if (!isStripeConfigured || !secret || !admin) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = getStripe()!;
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  async function applySubscription(
    db: NonNullable<ReturnType<typeof createAdminClient>>,
    subscription: Stripe.Subscription,
  ) {
    const groomerId = subscription.metadata?.groomer_id;
    if (!groomerId) return;

    const tier = subscription.metadata?.tier ?? "pro";
    const active = ["active", "trialing"].includes(subscription.status);

    await db
      .from("groomers")
      .update({
        // A lapsed subscription drops the listing back to the free tier
        // rather than deleting it — the business keeps its page and reviews.
        tier: active ? tier : "free",
        verified: active,
        subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        stripe_customer_id:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
      })
      .eq("id", groomerId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id,
        );
        await applySubscription(admin, subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await applySubscription(admin, event.data.object);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
