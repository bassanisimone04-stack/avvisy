"use server";

import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured, priceForPlan, stripe, type Plan } from "@/lib/stripe";

export type CheckoutResult = { url: string | null; reason?: string };

/** Avvia il Checkout Stripe per l'abbonamento della struttura del gestore.
 * Ritorna l'URL a cui reindirizzare, oppure url:null con un motivo leggibile
 * (mostrato all'utente) quando qualcosa non è configurato correttamente. */
export async function startCheckout(plan: Plan): Promise<CheckoutResult> {
  if (!isStripeConfigured())
    return {
      url: null,
      reason:
        "Chiave Stripe mancante sul server (STRIPE_SECRET_KEY). Aggiungila nelle Environment Variables di Vercel e rifai il deploy.",
    };
  if (!isSupabaseConfigured())
    return { url: null, reason: "Configurazione Supabase mancante sul server." };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return { url: null, reason: "Devi effettuare l'accesso per abbonarti." };

    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (orgErr)
      return { url: null, reason: `Errore database: ${orgErr.message}` };
    if (!org)
      return {
        url: null,
        reason:
          "Nessuna struttura collegata al tuo account. Crea prima la tua struttura, poi riprova.",
      };

    const priceId = priceForPlan(plan);
    if (!priceId)
      return {
        url: null,
        reason: `Price ID mancante per il piano "${plan}" (STRIPE_PRICE_${plan.toUpperCase()}). Controlla le variabili su Vercel.`,
      };

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
      success_url: `${origin}/dashboard/abbonamento/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/abbonamento`,
      metadata: { org_id: org.id },
      subscription_data: { metadata: { org_id: org.id } },
      allow_promotion_codes: true,
    });

    if (!session.url)
      return { url: null, reason: "Stripe non ha restituito un link di pagamento." };
    return { url: session.url };
  } catch (err) {
    // Registriamo il dettaglio lato server e mostriamo il messaggio Stripe
    // all'utente (è il proprietario della struttura, non un dato sensibile).
    console.error("startCheckout ha fallito:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return { url: null, reason: `Errore Stripe: ${msg}` };
  }
}
