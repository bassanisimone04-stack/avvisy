// Pagamenti reali attivi quando è presente la chiave pubblicabile Stripe.
// La chiave segreta resta solo lato server (nelle route API).
export const paymentsEnabled =
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "").length > 0;
