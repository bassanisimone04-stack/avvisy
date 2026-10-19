import type { Catalog } from "./catalog";
import { MATCH_LABEL, PRICE_BAND_LABEL } from "./site";
import type { SunglassesModel } from "./types";

export const COMPARE_LIMIT = 3;

/** Parses `ids=a,b,c` plus an optional `add=d`; keeps known ids only, unique, max 3. */
export function parseCompareIds(c: Catalog, ids?: string, add?: string): string[] {
  const out: string[] = [];
  for (const id of [...(ids ?? "").split(","), add ?? ""].map((s) => s.trim())) if (id && c.modelById.has(id) && !out.includes(id)) out.push(id);
  return out.slice(0, COMPARE_LIMIT);
}

export interface CompareRow { label: string; values: string[]; differs: boolean }

export function compareRows(c: Catalog, models: SunglassesModel[]): CompareRow[] {
  const row = (label: string, f: (m: SunglassesModel) => string): CompareRow => {
    const values = models.map(f);
    return { label, values, differs: new Set(values).size > 1 };
  };
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return [
    row("Brand", (m) => c.brandById.get(m.brandId)?.name ?? "—"),
    row("Evidence grade", (m) => MATCH_LABEL[c.modelMatch(m.id)]),
    row("Seen in", (m) => [...new Set(c.appsForModel(m.id).map((a) => c.movieById.get(a.movieId)?.title))].filter(Boolean).join(", ") || "Not seen on screen (look-alike)"),
    row("Sources recorded", (m) => String(c.appsForModel(m.id).reduce((n, a) => n + (c.evByApp.get(a.id)?.length ?? 0), 0))),
    row("Status", (m) => ({ in_production: "In production", discontinued: "Discontinued", vintage: "Vintage", unknown: "Availability unverified" })[m.status]),
    row("Shape", (m) => cap(m.shape)),
    row("Frame", (m) => m.frameColor),
    row("Lenses", (m) => m.lensColor),
    row("Reference", (m) => m.modelCode ?? "—"),
    row("Price band", (m) => { const { band, source } = c.priceBandOf(m); return band ? `${PRICE_BAND_LABEL[band]}${source === "editorial" ? " (estimate)" : ""}` : "Not rated"; }),
    row("Lowest verified offer", (m) => { const o = c.lowestOffer(m.id); return o?.price != null ? `$${o.price.toFixed(2)} at ${c.merchantById.get(o.merchantId)?.name}` : "None yet"; }),
    row("Cheaper alternatives", (m) => String(c.alternativesOf(m.id).length)),
  ];
}
