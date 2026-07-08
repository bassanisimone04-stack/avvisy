// Verifica rapida della configurazione Stripe.
// Uso:  node --env-file=.env.local scripts/check-stripe.mjs
//
// Controlla che la chiave segreta sia valida e che i due Price ID
// esistano, siano attivi e ricorrenti (abbonamento, non pagamento singolo).

import Stripe from "stripe";

const { STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_MULTI } = process.env;

let ok = true;
const fail = (msg) => {
  ok = false;
  console.error("  ✗ " + msg);
};
const pass = (msg) => console.log("  ✓ " + msg);

if (!STRIPE_SECRET_KEY) {
  console.error("✗ STRIPE_SECRET_KEY mancante in .env.local");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

console.log("Chiave segreta…");
try {
  const acct = await stripe.accounts.retrieve();
  pass(`connesso all'account Stripe ${acct.id}`);
  if (STRIPE_SECRET_KEY.startsWith("sk_test_")) {
    console.log("  ℹ modalità TEST (i pagamenti non sono reali)");
  }
} catch (e) {
  fail(`chiave non valida: ${e.message}`);
  process.exit(1);
}

for (const [name, id] of [
  ["STRIPE_PRICE_PRO", STRIPE_PRICE_PRO],
  ["STRIPE_PRICE_MULTI", STRIPE_PRICE_MULTI],
]) {
  console.log(`\n${name}…`);
  if (!id) {
    fail(`${name} mancante`);
    continue;
  }
  if (id.startsWith("prod_")) {
    fail(`hai messo un Product ID (prod_…). Serve il Price ID (price_…).`);
    continue;
  }
  try {
    const price = await stripe.prices.retrieve(id);
    if (!price.active) fail(`il prezzo ${id} non è attivo`);
    else if (price.type !== "recurring")
      fail(`il prezzo ${id} è "one-time", non un abbonamento ricorrente`);
    else {
      const amount = (price.unit_amount / 100).toFixed(2);
      pass(`${amount} ${price.currency.toUpperCase()} / ${price.recurring.interval}`);
    }
  } catch (e) {
    fail(`prezzo non trovato: ${e.message}`);
  }
}

console.log(ok ? "\n✅ Configurazione Stripe a posto." : "\n❌ Correggi i problemi qui sopra.");
process.exit(ok ? 0 : 1);
