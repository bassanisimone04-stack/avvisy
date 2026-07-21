import Link from "next/link";
import Stripe from "stripe";
import { IconCheck, IconShield } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Pagina di ritorno dopo il pagamento Stripe. Verifica la sessione e, se il
 * pagamento è andato a buon fine, segna l'ordine come pagato nel database
 * (l'utente autenticato è il compratore proprietario dell'ordine).
 */
export default async function PagamentoSuccessoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const secret = process.env.STRIPE_SECRET_KEY;

  let paid = false;
  let orderCode: string | null = null;

  if (secret && sessionId) {
    try {
      const stripe = new Stripe(secret);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const orderId = session.metadata?.orderId;
      const supabase = await createClient();
      if (session.payment_status === "paid" && orderId && supabase) {
        const { data: order } = await supabase
          .from("orders")
          .select("code, history, paid")
          .eq("id", orderId)
          .single();
        if (order) {
          orderCode = order.code ?? null;
          if (!order.paid) {
            const today = new Date().toISOString().slice(0, 10);
            const history = Array.isArray(order.history) ? order.history : [];
            await supabase
              .from("orders")
              .update({
                paid: true,
                payment_method: "Carta (Stripe)",
                status: "Confermato",
                history: [...history, { status: "Confermato", date: today, note: "Pagamento ricevuto" }],
              })
              .eq("id", orderId);
          }
          paid = true;
        }
      }
    } catch {
      /* verifica non riuscita: mostriamo comunque un messaggio prudente */
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8 text-center">
        {paid ? (
          <>
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-verified-soft text-verified">
              <IconCheck width={32} height={32} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Pagamento completato</h1>
            <p className="mt-2 text-sm text-muted">
              {orderCode ? <>L&apos;ordine <strong>{orderCode}</strong> risulta pagato e confermato.</> : "Il tuo ordine risulta pagato e confermato."}
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal-soft text-signal">
              <IconShield width={30} height={30} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Pagamento in verifica</h1>
            <p className="mt-2 text-sm text-muted">
              Non siamo riusciti a confermare subito il pagamento. Se hai completato l&apos;operazione, lo stato dell&apos;ordine si aggiornerà a breve.
            </p>
          </>
        )}
        <Link href="/compratore/ordini" className="btn btn-primary btn-block mt-6">
          Vai ai tuoi ordini
        </Link>
      </div>
    </div>
  );
}
