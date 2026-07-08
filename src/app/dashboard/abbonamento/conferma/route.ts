import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured, stripe } from "@/lib/stripe";

/** Ritorno dal Checkout Stripe: verifica la sessione di pagamento e, se
 * risulta pagata, segna l'abbonamento come attivo. Fa da alternativa al
 * webhook, così l'attivazione funziona anche senza configurarlo. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const dashboard = new URL("/dashboard?abbonato=1", url.origin);

  if (!isStripeConfigured() || !sessionId) {
    return NextResponse.redirect(dashboard);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", url.origin));

    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const orgId = session.metadata?.org_id;
    const paid =
      session.payment_status === "paid" || session.status === "complete";

    if (orgId && paid) {
      // Le RLS consentono l'update solo al proprietario: il filtro su owner_id
      // garantisce che nessuno possa attivare l'abbonamento di un'altra struttura.
      await supabase
        .from("organizations")
        .update({ subscription_status: "active" })
        .eq("id", orgId)
        .eq("owner_id", user.id);
    }
  } catch (err) {
    console.error("conferma abbonamento fallita:", err);
  }

  return NextResponse.redirect(dashboard);
}
