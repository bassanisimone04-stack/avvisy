import type { Restaurant } from "@/db/types";
import { toEUR, type Rates } from "./price";

export type Stat = { key: string; label: string; currency: string; avg: number | null; min: number | null; max: number | null; n: number; collectedAt: string | null; suppressed: boolean };

const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
const latest = (ds: (string | undefined)[]) => ds.filter(Boolean).sort().at(-1) ?? null;

/** Group verified prices by `groupBy` (e.g. city) in ORIGINAL currency. Figures with n < minSample are suppressed. */
export function statsBy(list: Restaurant[], opts: { kind: "tasting" | "wine_pairing"; service?: "lunch" | "dinner"; groupBy: (r: Restaurant) => string; label: (key: string) => string; minSample: number }): Stat[] {
  const groups = new Map<string, { amounts: number[]; currency: string; dates: (string | undefined)[] }>();
  for (const r of list) {
    for (const m of r.menus) {
      if (m.kind !== opts.kind || (opts.service && m.service !== opts.service) || m.status !== "verified" || m.amount == null) continue;
      const key = `${opts.groupBy(r)}|${m.currency}`;
      const g = groups.get(key) ?? { amounts: [], currency: m.currency, dates: [] };
      g.amounts.push(m.amount);
      g.dates.push(m.collectedAt);
      groups.set(key, g);
    }
  }
  return [...groups.entries()].map(([k, g]) => {
    const key = k.split("|")[0]!;
    const n = g.amounts.length;
    const suppressed = n < opts.minSample;
    return { key, label: opts.label(key), currency: g.currency, n, collectedAt: latest(g.dates), suppressed, avg: suppressed ? null : avg(g.amounts), min: suppressed ? null : Math.min(...g.amounts), max: suppressed ? null : Math.max(...g.amounts) };
  }).sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));
}

/** Lunch vs dinner: average ratio (lunch/dinner) over venues with BOTH verified. */
export function lunchDinnerRatio(list: Restaurant[], minSample: number) {
  const ratios: number[] = [];
  const dates: (string | undefined)[] = [];
  for (const r of list) {
    const l = r.menus.find((m) => m.kind === "tasting" && m.service === "lunch" && m.status === "verified" && m.amount != null);
    const d = r.menus.find((m) => m.kind === "tasting" && m.service === "dinner" && m.status === "verified" && m.amount != null);
    if (l && d && l.currency === d.currency) { ratios.push(l.amount! / d.amount!); dates.push(d.collectedAt); }
  }
  const n = ratios.length;
  return { n, suppressed: n < minSample, ratio: n >= minSample ? Math.round((ratios.reduce((a, b) => a + b, 0) / n) * 100) / 100 : null, collectedAt: latest(dates) };
}

/** Cheapest recognised venues by lowest verified tasting price, converted to EUR (labelled with rate source). */
export function cheapestRecognised(list: Restaurant[], rates: Rates | null, limit = 5) {
  return list
    .filter((r) => r.recognition.level > 0)
    .map((r) => {
      const ms = r.menus.filter((m) => m.kind === "tasting" && m.status === "verified" && m.amount != null);
      const best = ms.map((m) => ({ m, eur: toEUR(m.amount!, m.currency, rates) })).filter((x) => x.eur != null).sort((a, b) => a.eur! - b.eur!)[0];
      return best ? { r, amount: best.m.amount!, currency: best.m.currency, eur: best.eur!, collectedAt: best.m.collectedAt } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => a.eur - b.eur)
    .slice(0, limit);
}
