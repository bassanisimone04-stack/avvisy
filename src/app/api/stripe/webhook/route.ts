import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeConfigured, stripe } from "@/lib/stripe";

function customerId(c: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!c) return null;
  return typeof c === "string" ? c : c.id;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured() || !secret) {
    return NextResponse.json({ error: "not configured" }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const status =
          event.type === "customer.subscription.deleted"
            ? "canceled"
            : sub.status;
        const cid = customerId(sub.customer);
        if (cid) {
          await admin
            .from("organizations")
            .update({ subscription_status: status })
            .eq("stripe_customer_id", cid);
        }
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const cid = customerId(session.customer);
        if (cid) {
          await admin
            .from("organizations")
            .update({ subscription_status: "active" })
            .eq("stripe_customer_id", cid);
        }
        break;
      }
      default:
        break;
    }
  } catch {
    // Non blocchiamo Stripe: se il DB non risponde, l'evento verrà rimandato.
  }

  return NextResponse.json({ received: true });
}
