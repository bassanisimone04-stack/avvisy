// Pagamenti reali attivi quando è presente la chiave pubblicabile Stripe.
// La chiave segreta resta solo lato server (nelle route API).
// Variabili d'ambiente richieste (Vercel, ambiente Production):
//   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_... (o pk_live_...)
//   - STRIPE_SECRET_KEY = sk_test_... (o sk_live_...)
// Nota: NEXT_PUBLIC_* viene "congelata" a build time → serve un Redeploy.
export const paymentsEnabled =
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "").length > 0;
