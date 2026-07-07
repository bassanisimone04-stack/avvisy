"use server";

import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured, priceForPlan, stripe, type Plan } from "@/lib/stripe";

/** Avvia il Checkout Stripe per l'abbonamento della struttura del gestore.
 * Ritorna l'URL a cui reindirizzare, o null se non configurato. */
export async function startCheckout(
  plan: Plan
): Promise<{ url: string | null }> {
  if (!isStripeConfigured() || !isSupabaseConfigured()) return { url: null };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { url: null };

    const { data: org } = await supabase
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (!org) return { url: null };

    const priceId = priceForPlan(plan);
    if (!priceId) return { url: null };

    const s = stripe();

    // Cliente Stripe: riusa quello esistente o creane uno.
    let customerId: string | null = org.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await s.customers.create({
        email: user.email ?? undefined,
        name: org.name,
        metadata: { org_id: org.id },
      });
      customerId = customer.id;
      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", org.id);
    }

    const h = await headers();
    const origin =
      h.get("origin") ?? (h.get("host") ? `https://${h.get("host")}` : "");

    const session = await s.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?abbonato=1`,
      cancel_url: `${origin}/dashboard/abbonamento`,
      metadata: { org_id: org.id },
      subscription_data: { metadata: { org_id: org.id } },
      allow_promotion_codes: true,
    });

    return { url: session.url };
  } catch {
    return { url: null };
  }
}
