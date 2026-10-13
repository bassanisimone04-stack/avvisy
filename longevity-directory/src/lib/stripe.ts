/**
 * Integrazione Stripe reale ma "a spegnimento esplicito": senza
 * STRIPE_SECRET_KEY nell'ambiente, `stripeEnabled` è false e l'interfaccia
 * mostra uno stato onesto ("in configurazione") invece di un checkout finto
 * che sembra funzionare e non funziona. Nessuna chiamata a Stripe avviene
 * mai senza chiave configurata.
 *
 * Per attivarlo davvero: crea un account Stripe (anche solo in test mode),
 * recupera la chiave segreta e i price id, e imposta le variabili in .env
 * (vedi .env.example). Non è qualcosa che si può fare al posto tuo: le
 * credenziali sono personali dell'account Stripe.
 */

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  verificato: process.env.STRIPE_PRICE_VERIFICATO,
  premium: process.env.STRIPE_PRICE_PREMIUM,
  esclusiva: process.env.STRIPE_PRICE_ESCLUSIVA,
};

let stripeClient: import("stripe").default | null = null;

async function getStripe() {
  if (!stripeEnabled) return null;
  if (!stripeClient) {
    const { default: Stripe } = await import("stripe");
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export async function createCheckoutSession(params: {
  piano: "verificato" | "premium" | "esclusiva";
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe non configurato: manca STRIPE_SECRET_KEY.");

  const priceId = STRIPE_PRICE_IDS[params.piano];
  if (!priceId) throw new Error(`Nessun price id configurato per il piano "${params.piano}".`);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
  });

  return session.url;
}
