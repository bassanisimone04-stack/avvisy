import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * Crea una sessione di pagamento Stripe per un ordine esistente non pagato.
 * L'importo viene letto dal database (non dal client) per sicurezza.
 * Richiede la variabile d'ambiente STRIPE_SECRET_KEY.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Pagamenti non configurati." }, { status: 501 });
  }

  let orderId: string | undefined;
  try {
    const body = await req.json();
    orderId = body?.orderId;
  } catch {
    /* body non valido */
  }
  if (!orderId) {
    return NextResponse.json({ error: "Ordine mancante." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Backend non configurato." }, { status: 501 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  // L'ordine è leggibile solo dal compratore/venditore (RLS).
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, code, lot_title, total, paid")
    .eq("id", orderId)
    .single();
  if (error || !order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }
  if (order.paid) {
    return NextResponse.json({ error: "Ordine già pagato." }, { status: 409 });
  }

  const amount = Math.round(Number(order.total) * 100);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Importo non valido." }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const stripe = new Stripe(secret);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: `Ordine ${order.code} — ${order.lot_title}` },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${origin}/pagamento/successo?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/compratore/ordini`,
  });

  return NextResponse.json({ url: session.url });
}
