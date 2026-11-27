import type { Rates } from "./price";

/**
 * ILLUSTRATIVE rates used only to rank/convert fictional demo prices when no live FX provider
 * is reachable. Not market data — the UI labels conversions made with them as "illustrative".
 */
export const DEMO_REFERENCE_RATES: Rates = {
  base: "EUR",
  date: "demo",
  source: "demo-reference",
  rates: { USD: 1.1, GBP: 0.85, JPY: 165, CHF: 0.95, AED: 4, SGD: 1.45, CAD: 1.5, AUD: 1.65, DKK: 7.45 },
};
