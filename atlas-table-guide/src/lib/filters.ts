import type { Features, Restaurant, ReservationMethod } from "@/db/types";
import { haversine, inBBox, type BBox } from "./geo";
import { menuPrice, toEUR, usable, type Rates } from "./price";
import { scoreText } from "./search";

export const FEATURE_KEYS = ["romantic", "terrace", "seaView", "chefsTable", "privateDining", "rooms", "giftCard", "accessible", "parking"] as const satisfies readonly (keyof Features)[];
export const DIET_KEYS = ["vegetarian", "vegan", "glutenFree"] as const;
export const SORTS = ["recommended", "price-asc", "price-desc", "distance", "updated", "recognition", "az"] as const;
export type Sort = (typeof SORTS)[number];
type Range = { min?: number; max?: number };

export interface Filters {
  q?: string;
  country?: string;
  region?: string;
  city?: string;
  recognition: number[];
  selection: boolean;
  cuisine: string[];
  lunch: Range;
  dinner: Range;
  wine: Range;
  diet: (typeof DIET_KEYS)[number][];
  features: (keyof Features)[];
  reservation?: ReservationMethod;
  sort: Sort;
  near?: { lat: number; lng: number };
  bbox?: BBox;
  page: number;
  view: "grid" | "map";
}

type SP = Record<string, string | string[] | undefined> | URLSearchParams;
const get = (sp: SP, k: string): string | undefined => {
  if (sp instanceof URLSearchParams) return sp.get(k) ?? undefined;
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v;
};
const list = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const range = (v?: string): Range => {
  if (!v) return {};
  const [a, b] = v.split("-");
  const min = a ? Number(a) : undefined;
  const max = b ? Number(b) : undefined;
  return { min: Number.isFinite(min) ? min : undefined, max: Number.isFinite(max) ? max : undefined };
};
const slugish = (s?: string) => (s && /^[a-z0-9-]{1,80}$/.test(s) ? s : undefined);

export function parseFilters(sp: SP): Filters {
  const near = get(sp, "near")?.split(",").map(Number);
  const bbox = get(sp, "bbox")?.split(",").map(Number);
  const sort = get(sp, "sort") as Sort | undefined;
  const page = Number(get(sp, "page") ?? 1);
  const res = get(sp, "res") as ReservationMethod | undefined;
  return {
    q: get(sp, "q")?.slice(0, 100) || undefined,
    country: slugish(get(sp, "country")),
    region: slugish(get(sp, "region")),
    city: slugish(get(sp, "city")),
    recognition: list(get(sp, "rec")).map(Number).filter((n) => [0, 1, 2, 3].includes(n)),
    selection: get(sp, "sel") === "1",
    cuisine: list(get(sp, "cuisine")).filter((c) => /^[a-z0-9-]+$/.test(c)),
    lunch: range(get(sp, "lunch")),
    dinner: range(get(sp, "dinner")),
    wine: range(get(sp, "wine")),
    diet: list(get(sp, "diet")).filter((d): d is Filters["diet"][number] => (DIET_KEYS as readonly string[]).includes(d)),
    features: list(get(sp, "feat")).filter((f): f is keyof Features => (FEATURE_KEYS as readonly string[]).includes(f)),
    reservation: res && ["online", "phone", "email"].includes(res) ? res : undefined,
    sort: sort && (SORTS as readonly string[]).includes(sort) ? sort : "recommended",
    near: near && near.length === 2 && near.every(Number.isFinite) ? { lat: near[0]!, lng: near[1]! } : undefined,
    bbox: bbox && bbox.length === 4 && bbox.every(Number.isFinite) ? (bbox as BBox) : undefined,
    page: Number.isInteger(page) && page > 0 && page < 1000 ? page : 1,
    view: get(sp, "view") === "map" ? "map" : "grid",
  };
}

/** Serialise back to a query string (stable key order, defaults omitted). */
export function serializeFilters(f: Partial<Filters>, omit: (keyof Filters)[] = []): string {
  const p = new URLSearchParams();
  const r = (x?: Range) => (x && (x.min != null || x.max != null) ? `${x.min ?? ""}-${x.max ?? ""}` : "");
  const set = (k: string, v: string | undefined, key: keyof Filters) => {
    if (v && !omit.includes(key)) p.set(k, v);
  };
  set("q", f.q, "q");
  set("country", f.country, "country");
  set("region", f.region, "region");
  set("city", f.city, "city");
  set("rec", f.recognition?.length ? [...f.recognition].sort().join(",") : undefined, "recognition");
  set("sel", f.selection ? "1" : undefined, "selection");
  set("cuisine", f.cuisine?.length ? [...f.cuisine].sort().join(",") : undefined, "cuisine");
  set("lunch", r(f.lunch), "lunch");
  set("dinner", r(f.dinner), "dinner");
  set("wine", r(f.wine), "wine");
  set("diet", f.diet?.length ? [...f.diet].sort().join(",") : undefined, "diet");
  set("feat", f.features?.length ? [...f.features].sort().join(",") : undefined, "features");
  set("res", f.reservation, "reservation");
  set("sort", f.sort && f.sort !== "recommended" ? f.sort : undefined, "sort");
  set("near", f.near ? `${f.near.lat.toFixed(3)},${f.near.lng.toFixed(3)}` : undefined, "near");
  set("bbox", f.bbox ? f.bbox.map((n) => n.toFixed(4)).join(",") : undefined, "bbox");
  set("view", f.view === "map" ? "map" : undefined, "view");
  set("page", f.page && f.page > 1 ? String(f.page) : undefined, "page");
  return p.toString();
}

/** Number of user-chosen filters (excludes sort, view, page, location context from the path). */
export function activeFilterCount(f: Filters): number {
  return (
    (f.q ? 1 : 0) + f.recognition.length + (f.selection ? 1 : 0) + f.cuisine.length + f.diet.length + f.features.length +
    ["lunch", "dinner", "wine"].filter((k) => { const x = f[k as "lunch"]; return x.min != null || x.max != null; }).length +
    (f.reservation ? 1 : 0) + (f.bbox ? 1 : 0)
  );
}

function priceEUR(r: Restaurant, kind: "tasting" | "wine_pairing", service: "lunch" | "dinner" | undefined, rates: Rates | null) {
  const m = menuPrice(r, kind, service);
  if (!m || !usable(m)) return null;
  return toEUR(m.amount!, m.currency, rates);
}
const inRange = (v: number | null, x: Range) => {
  if (x.min == null && x.max == null) return true;
  if (v == null) return false;
  return (x.min == null || v >= x.min) && (x.max == null || v <= x.max);
};

/** Lowest tasting price in EUR (for sorting & budget collections). */
export function lowestEUR(r: Restaurant, rates: Rates | null): number | null {
  const vals = [priceEUR(r, "tasting", "lunch", rates), priceEUR(r, "tasting", "dinner", rates)].filter((v): v is number => v != null);
  return vals.length ? Math.min(...vals) : null;
}

export function applyFilters(list: Restaurant[], f: Filters, rates: Rates | null, extraText?: (r: Restaurant) => string): Restaurant[] {
  return list.filter((r) => {
    if (f.country && r.countrySlug !== f.country) return false;
    if (f.region && r.regionSlug !== f.region) return false;
    if (f.city && r.citySlug !== f.city) return false;
    if (f.recognition.length && !f.recognition.includes(r.recognition.level)) return false;
    if (f.selection && !r.atlasSelection) return false;
    if (f.cuisine.length && !f.cuisine.some((c) => r.cuisines.includes(c))) return false;
    if (!inRange(priceEUR(r, "tasting", "lunch", rates), f.lunch)) return false;
    if (!inRange(priceEUR(r, "tasting", "dinner", rates), f.dinner)) return false;
    if (!inRange(priceEUR(r, "wine_pairing", undefined, rates), f.wine)) return false;
    if (f.diet.some((d) => !r.dietary[d])) return false;
    if (f.features.some((k) => !r.features[k])) return false;
    if (f.reservation && r.reservation.method !== f.reservation) return false;
    if (f.bbox && !inBBox(r, f.bbox)) return false;
    if (f.q && scoreText(f.q, `${r.name} ${r.cuisines.join(" ")} ${r.style.en} ${extraText?.(r) ?? ""}`) < 0.5) return false;
    return true;
  });
}

const VER_RANK: Record<string, number> = { verified: 0, pending: 1, stale: 2, unverified: 3, rejected: 4 };

export function sortRestaurants(list: Restaurant[], f: Pick<Filters, "sort" | "near">, rates: Rates | null): Restaurant[] {
  const out = [...list];
  const byName = (a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name);
  const nulls = (a: number | null, b: number | null, dir: 1 | -1) => (a == null && b == null ? 0 : a == null ? 1 : b == null ? -1 : (a - b) * dir);
  switch (f.sort) {
    case "price-asc":
      return out.sort((a, b) => nulls(lowestEUR(a, rates), lowestEUR(b, rates), 1) || byName(a, b));
    case "price-desc":
      return out.sort((a, b) => nulls(lowestEUR(a, rates), lowestEUR(b, rates), -1) || byName(a, b));
    case "distance":
      if (!f.near) return out.sort(byName);
      return out.sort((a, b) => haversine(f.near!, a) - haversine(f.near!, b));
    case "updated":
      return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || byName(a, b));
    case "recognition":
      return out.sort((a, b) => b.recognition.level - a.recognition.level || byName(a, b));
    case "az":
      return out.sort(byName);
    default:
      // Recommended: editorial signals only — commercial plans never affect this order.
      return out.sort(
        (a, b) =>
          Number(b.atlasSelection) - Number(a.atlasSelection) ||
          b.recognition.level - a.recognition.level ||
          (VER_RANK[a.verificationStatus] ?? 9) - (VER_RANK[b.verificationStatus] ?? 9) ||
          Number(b.featured) - Number(a.featured) ||
          byName(a, b),
      );
  }
}

export function paginate<T>(list: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(list.length / size));
  const p = Math.min(Math.max(1, page), pages);
  return { items: list.slice((p - 1) * size, p * size), page: p, pages, total: list.length };
}

/** Facet counts for the sidebar (computed over the list filtered by everything except that facet). */
export function facetCounts(list: Restaurant[]) {
  const c = { recognition: {} as Record<number, number>, cuisine: {} as Record<string, number>, features: {} as Record<string, number>, diet: {} as Record<string, number> };
  for (const r of list) {
    c.recognition[r.recognition.level] = (c.recognition[r.recognition.level] ?? 0) + 1;
    for (const cu of r.cuisines) c.cuisine[cu] = (c.cuisine[cu] ?? 0) + 1;
    for (const k of FEATURE_KEYS) if (r.features[k]) c.features[k] = (c.features[k] ?? 0) + 1;
    for (const k of DIET_KEYS) if (r.dietary[k]) c.diet[k] = (c.diet[k] ?? 0) + 1;
  }
  return c;
}
