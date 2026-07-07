import Stripe from "stripe";

export type Plan = "base" | "pro" | "multi";

/** Le chiavi Stripe sono presenti? Se no, i pulsanti di pagamento restano
 * inattivi (l'app funziona comunque). */
export function isStripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

/** Client Stripe lato server. */
export function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
}

/** Price ID Stripe per ciascun piano (impostati nelle variabili d'ambiente). */
export function priceForPlan(plan: Plan): string | undefined {
  return {
    base: process.env.STRIPE_PRICE_BASE,
    pro: process.env.STRIPE_PRICE_PRO,
    multi: process.env.STRIPE_PRICE_MULTI,
  }[plan];
}

export const PLAN_LABELS: Record<Plan, string> = {
  base: "Base",
  pro: "Pro",
  multi: "Multi-sede",
};
