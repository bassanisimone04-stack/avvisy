import { normalize } from "./format";
import { parseCsv } from "./keywords";
import type { AffiliateOffer, Availability, Merchant, SunglassesModel } from "./types";

export interface ImportError { line: number; message: string }
export interface ImportResult { offers: AffiliateOffer[]; errors: ImportError[]; rows: number }

const HEAD = {
  model: ["model", "model id", "model slug", "product", "product name", "name"],
  merchant: ["merchant", "store", "merchant id", "retailer", "network"],
  price: ["price", "sale price", "current price"],
  currency: ["currency"],
  availability: ["availability", "stock", "in stock"],
  shipping: ["shipping", "shipping cost"],
  url: ["url", "link", "affiliate url", "deep link", "product url"],
  checked: ["last checked", "last_checked", "date", "updated", "checked at"],
};
const AVAIL: Record<string, Availability> = {
  "in_stock": "in_stock", "in stock": "in_stock", "instock": "in_stock", "yes": "in_stock", "true": "in_stock",
  "limited": "limited", "low stock": "limited", "out_of_stock": "out_of_stock", "out of stock": "out_of_stock", "no": "out_of_stock", "false": "out_of_stock", "unknown": "unknown", "": "unknown",
};

/**
 * Turns an affiliate-feed style CSV into offers, validating every row. Nothing is guessed:
 * unknown models/merchants, non-https URLs, negative prices or non-USD currencies are rejected, never "fixed".
 * Re-importing the same model+merchant updates that offer (stable id) instead of duplicating it.
 */
export function offersFromCsv(text: string, models: SunglassesModel[], merchants: Merchant[], today = new Date().toISOString().slice(0, 10)): ImportResult {
  const rows = parseCsv(text);
  const errors: ImportError[] = [];
  if (rows.length < 2) return { offers: [], errors: [{ line: 1, message: "Servono una riga di intestazione e almeno una riga di dati." }], rows: 0 };
  const head = rows[0].map(normalize);
  const col = (names: string[]) => head.findIndex((h) => names.map(normalize).includes(h));
  const idx = Object.fromEntries(Object.entries(HEAD).map(([k, v]) => [k, col(v)])) as Record<keyof typeof HEAD, number>;
  for (const need of ["model", "merchant", "url"] as const) if (idx[need] < 0) errors.push({ line: 1, message: `Colonna obbligatoria mancante: ${need}.` });
  if (errors.length) return { offers: [], errors, rows: rows.length - 1 };

  const byModel = new Map<string, SunglassesModel>();
  for (const m of models) { byModel.set(normalize(m.id), m); byModel.set(normalize(m.slug), m); byModel.set(normalize(m.name), m); }
  const byMerchant = new Map<string, Merchant>();
  for (const m of merchants) { byMerchant.set(normalize(m.id), m); byMerchant.set(normalize(m.slug), m); byMerchant.set(normalize(m.name), m); }

  const out = new Map<string, AffiliateOffer>();
  rows.slice(1).forEach((r, i) => {
    const line = i + 2, cell = (k: keyof typeof HEAD) => (idx[k] >= 0 ? (r[idx[k]] ?? "").trim() : "");
    const fail = (message: string) => errors.push({ line, message });
    const model = byModel.get(normalize(cell("model"))), merchant = byMerchant.get(normalize(cell("merchant")));
    if (!model) return fail(`Modello sconosciuto: «${cell("model")}». Usa id, slug o nome esatto.`);
    if (!merchant) return fail(`Negozio sconosciuto: «${cell("merchant")}». Crealo prima in «Negozi».`);
    const url = cell("url");
    let ok = false; try { ok = new URL(url).protocol === "https:"; } catch { /* invalid */ }
    if (!ok) return fail("L'URL deve essere un indirizzo https valido.");
    const rawPrice = cell("price");
    let price: number | null = null;
    if (rawPrice) { price = Number(rawPrice.replace(/[^0-9.,-]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", ".")); if (!Number.isFinite(price) || price < 0) return fail(`Prezzo non valido: «${rawPrice}».`); }
    const currency = (cell("currency") || "USD").toUpperCase();
    if (currency !== "USD") return fail(`Valuta non supportata (${currency}): il sito mostra solo USD.`);
    const availability = AVAIL[normalize(cell("availability")).replace(/ /g, " ")] ?? null;
    if (!availability) return fail(`Disponibilità non riconosciuta: «${cell("availability")}».`);
    const checked = cell("checked");
    if (checked && !/^\d{4}-\d{2}-\d{2}$/.test(checked)) return fail("La data deve essere AAAA-MM-GG.");
    const id = `off_${model.id}_${merchant.id}`.slice(0, 120);
    out.set(id, { id, modelId: model.id, merchantId: merchant.id, price, currency, availability: price == null ? "unknown" : availability, shipping: cell("shipping"), url, lastChecked: checked || today });
  });
  return { offers: [...out.values()], errors, rows: rows.length - 1 };
}
