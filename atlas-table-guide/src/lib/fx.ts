import "server-only";
import type { Rates } from "./price";
import { SITE } from "@/config/site";
import { DEMO_REFERENCE_RATES } from "./fx-demo";

/**
 * Daily FX rates (EUR base). Provider configurable via FX_PROVIDER:
 *  - "frankfurter" (default, ECB reference rates, no key)  - "none"
 * Falls back to clearly labelled illustrative demo rates only while demo data is shown,
 * otherwise to "none" (UI then shows original currencies only and says so).
 */
export async function getRates(): Promise<Rates> {
  const provider = process.env.FX_PROVIDER ?? "frankfurter";
  if (provider === "frankfurter") {
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=EUR", {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const j = (await res.json()) as { date: string; rates: Record<string, number> };
        return { base: "EUR", date: j.date, source: "live", rates: j.rates };
      }
    } catch {
      /* fall through */
    }
  }
  if (SITE.allowDemoData) return DEMO_REFERENCE_RATES;
  return { base: "EUR", date: "", source: "none", rates: {} };
}
