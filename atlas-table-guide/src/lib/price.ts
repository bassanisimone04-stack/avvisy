import type { MenuPrice, Restaurant } from "@/db/types";

export type Rates = { base: "EUR"; date: string; source: "live" | "demo-reference" | "none"; rates: Record<string, number> };

const SYMBOLS: Record<string, string> = { "€": "EUR", $: "USD", "£": "GBP", "¥": "JPY", "₣": "CHF", "S$": "SGD", "A$": "AUD", "C$": "CAD", "US$": "USD", "د.إ": "AED", "kr": "DKK" };
const ZERO_DECIMAL = new Set(["JPY"]);

/**
 * Normalise a human-entered price ("€ 1.250,00", "1,250.50 EUR", "¥48,000", "120") into
 * { amount, currency }. Returns null if no number can be read.
 */
export function parsePrice(input: string | number, fallbackCurrency = "EUR"): { amount: number; currency: string } | null {
  if (typeof input === "number") return Number.isFinite(input) && input >= 0 ? { amount: round(input, fallbackCurrency), currency: fallbackCurrency } : null;
  const raw = input.trim();
  if (!raw) return null;
  let currency = fallbackCurrency;
  const iso = raw.match(/\b([A-Z]{3})\b/);
  if (iso) currency = iso[1]!;
  else {
    const sym = Object.keys(SYMBOLS).sort((a, b) => b.length - a.length).find((s) => raw.includes(s));
    if (sym) currency = SYMBOLS[sym]!;
  }
  const numPart = raw.replace(/[^\d.,\s']/g, "").replace(/[\s']/g, "");
  if (!/\d/.test(numPart)) return null;
  let normalised: string;
  const lastComma = numPart.lastIndexOf(",");
  const lastDot = numPart.lastIndexOf(".");
  if (lastComma > -1 && lastDot > -1) {
    // the later separator is the decimal one
    normalised = lastComma > lastDot ? numPart.replace(/\./g, "").replace(",", ".") : numPart.replace(/,/g, "");
  } else if (lastComma > -1) {
    const decimals = numPart.length - lastComma - 1;
    normalised = decimals === 3 || (numPart.match(/,/g)?.length ?? 0) > 1 ? numPart.replace(/,/g, "") : numPart.replace(",", ".");
  } else if (lastDot > -1) {
    const decimals = numPart.length - lastDot - 1;
    normalised = decimals === 3 || (numPart.match(/\./g)?.length ?? 0) > 1 ? numPart.replace(/\./g, "") : numPart;
  } else normalised = numPart;
  const amount = Number(normalised);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return { amount: round(amount, currency), currency };
}

function round(n: number, currency: string) {
  return ZERO_DECIMAL.has(currency) ? Math.round(n) : Math.round(n * 100) / 100;
}

/** Convert using EUR-based rates (rates[X] = units of X per 1 EUR). null when a rate is unknown. */
export function convert(amount: number, from: string, to: string, rates: Rates | null): number | null {
  if (from === to) return amount;
  if (!rates || rates.source === "none") return null;
  const rf = from === "EUR" ? 1 : rates.rates[from];
  const rt = to === "EUR" ? 1 : rates.rates[to];
  if (!rf || !rt) return null;
  return round((amount / rf) * rt, to);
}

export const toEUR = (amount: number, from: string, rates: Rates | null) => convert(amount, from, "EUR", rates);

export function formatMoney(amount: number, currency: string, locale = "en"): string {
  try {
    return new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: ZERO_DECIMAL.has(currency) ? 0 : amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Only prices with status verified|estimated and an amount count as usable. */
export const usable = (m: MenuPrice) => m.amount != null && m.status !== "missing";

export function tastingMenus(r: Restaurant) {
  return r.menus.filter((m) => m.kind === "tasting" && usable(m));
}

/** Lowest tasting-menu price (any status except missing), in original currency. */
export function priceFrom(r: Restaurant): { amount: number; currency: string; status: MenuPrice["status"] } | null {
  const ms = tastingMenus(r);
  if (!ms.length) return null;
  const m = ms.reduce((a, b) => (a.amount! <= b.amount! ? a : b));
  return { amount: m.amount!, currency: m.currency, status: m.status };
}

export function menuPrice(r: Restaurant, kind: MenuPrice["kind"], service?: MenuPrice["service"]) {
  return r.menus.find((m) => m.kind === kind && (!service || m.service === service));
}

/**
 * Estimated combined experience for one guest: dinner tasting (or lunch) + wine pairing.
 * Always labelled "estimate" in the UI; null when the tasting price is missing.
 */
export function combinedEstimate(r: Restaurant): { amount: number; currency: string } | null {
  const dinner = menuPrice(r, "tasting", "dinner");
  const lunch = menuPrice(r, "tasting", "lunch");
  const base = dinner && usable(dinner) ? dinner : lunch && usable(lunch) ? lunch : null;
  if (!base) return null;
  const wine = menuPrice(r, "wine_pairing");
  return { amount: base.amount! + (wine && usable(wine) ? wine.amount! : 0), currency: base.currency };
}

/** Price band 1–4 from the EUR value of the lowest tasting menu. */
export function priceBand(eur: number | null): 0 | 1 | 2 | 3 | 4 {
  if (eur == null) return 0;
  if (eur <= 75) return 1;
  if (eur <= 150) return 2;
  if (eur <= 250) return 3;
  return 4;
}

export function priceRangeLabel(band: number, currency = "EUR") {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";
  return band ? sym.repeat(band) : "";
}
