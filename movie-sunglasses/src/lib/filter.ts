import type { Catalog } from "./catalog";
import { MATCH_ORDER } from "./evidence";
import { normalize } from "./format";
import type { SunglassesModel } from "./types";

export type Params = Record<string, string | string[] | undefined>;
export const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export const colorGroup = (frame: string) => {
  const f = frame.toLowerCase();
  if (/tortoise|havana/.test(f)) return "tortoise";
  if (/gold/.test(f)) return "gold";
  if (/black|ebony/.test(f)) return "black";
  if (/silver|metal/.test(f)) return "silver";
  if (/clear|crystal/.test(f)) return "clear";
  return "other";
};
const BAND_RANK = { under50: 0, under100: 1, under200: 2, over200: 3 } as const;
export const PAGE_SIZE = 12;

export function filterModels(c: Catalog, p: Params, base: SunglassesModel[] = c.models) {
  const q = normalize(one(p.q) ?? "");
  const movie = one(p.movie), actor = one(p.actor), brand = one(p.brand), shape = one(p.shape), color = one(p.color);
  const status = one(p.status), match = one(p.match), budget = one(p.budget), kind = one(p.kind);
  let rows = base.filter((m) => {
    if (q) {
      const hay = normalize(`${m.name} ${c.brandById.get(m.brandId)?.name} ${m.modelCode ?? ""} ${c.appsForModel(m.id).map((a) => `${c.movieById.get(a.movieId)?.title} ${c.actorById.get(a.actorId)?.name} ${c.charById.get(a.characterId)?.name}`).join(" ")}`);
      if (!q.split(" ").every((w) => hay.includes(w))) return false;
    }
    if (movie && !c.appsForModel(m.id).some((a) => a.movieId === movie)) return false;
    if (actor && !c.appsForModel(m.id).some((a) => a.actorId === actor)) return false;
    if (brand && m.brandId !== brand) return false;
    if (shape && m.shape !== shape) return false;
    if (color && colorGroup(m.frameColor) !== color) return false;
    if (status && m.status !== status) return false;
    if (match && c.modelMatch(m.id) !== match) return false;
    if (budget && c.priceBandOf(m).band !== budget) return false;
    if (kind === "screen" && c.isAlternativeOnly(m.id)) return false;
    if (kind === "alternative" && !c.isAlternativeOnly(m.id)) return false;
    return true;
  });
  const sort = one(p.sort) ?? "featured";
  const latestYear = (m: SunglassesModel) => Math.max(0, ...c.appsForModel(m.id).map((a) => c.movieById.get(a.movieId)?.year ?? 0));
  rows = [...rows].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "year") return latestYear(b) - latestYear(a) || a.name.localeCompare(b.name);
    if (sort === "price") {
      const pa = c.lowestOffer(a.id)?.price ?? 1e6 + (BAND_RANK[c.priceBandOf(a).band ?? "over200"] ?? 9) * 1000 + (c.priceBandOf(a).band ? 0 : 500);
      const pb = c.lowestOffer(b.id)?.price ?? 1e6 + (BAND_RANK[c.priceBandOf(b).band ?? "over200"] ?? 9) * 1000 + (c.priceBandOf(b).band ? 0 : 500);
      return pa - pb || a.name.localeCompare(b.name);
    }
    return MATCH_ORDER.indexOf(c.modelMatch(a.id)) - MATCH_ORDER.indexOf(c.modelMatch(b.id)) || c.appsForModel(b.id).length - c.appsForModel(a.id).length || a.name.localeCompare(b.name);
  });
  const page = Math.max(1, parseInt(one(p.page) ?? "1", 10) || 1);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  return { total: rows.length, page: Math.min(page, pages), pages, items: rows.slice((Math.min(page, pages) - 1) * PAGE_SIZE, Math.min(page, pages) * PAGE_SIZE) };
}

export const hasFilters = (p: Params) => Object.entries(p).some(([k, v]) => k !== "page" && !!one(v)) ;
export function paramsToStrings(p: Params): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(p).filter(([k]) => k !== "page").map(([k, v]) => [k, one(v)]));
}
