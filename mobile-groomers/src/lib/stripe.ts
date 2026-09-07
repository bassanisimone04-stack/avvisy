import Stripe from "stripe";

const SECRET = process.env.STRIPE_SECRET_KEY ?? "";

/** true when Stripe is configured; otherwise billing stays simulated. */
export const isStripeConfigured = SECRET.length > 0;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  return new Stripe(SECRET);
}

/**
 * Price IDs come from the Stripe dashboard. Keeping the mapping server-side
 * means the client can only name a tier, never an amount.
 */
export const TIER_PRICE_IDS: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRICE_PRO,
  fleet: process.env.STRIPE_PRICE_FLEET,
};
