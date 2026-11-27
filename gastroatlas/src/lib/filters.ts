import { type Locale, normalize } from "./i18n";
import type { Restaurant } from "@/data/catalog";

export type Sort = "" | "price" | "high" | "name";
export type Filters = { q: string; city: string; cuisine: string; level: string; max: string; rooms: boolean; sort: Sort };
export const emptyFilters: Filters = { q: "", city: "", cuisine: "", level: "", max: "", rooms: false, sort: "" };

type SP = URLSearchParams | { get(key: string): string | null; has(key: string): boolean };

/** Reads filters from a query string. Unknown/invalid values are ignored. */
export function parseFilters(sp: SP, forcedCity?: string): Filters {
  const sort = sp.get("sort");
  return {
    q: (sp.get("q") ?? "").slice(0, 100),
    city: forcedCity ?? sp.get("city") ?? "",
    cuisine: sp.get("cuisine") ?? "",
    level: ["1", "2", "3"].includes(sp.get("level") ?? "") ? sp.get("level")! : "",
    max: /^\d{1,6}$/.test(sp.get("max") ?? "") ? sp.get("max")! : "",
    rooms: sp.has("rooms"),
    sort: sort === "price" || sort === "high" || sort === "name" ? sort : "",
  };
}

/** Only non-empty values, stable key order — used for the shareable URL. */
export function serializeFilters(f: Filters, omit: (keyof Filters)[] = []): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f) as [keyof Filters, string | boolean][]) {
    if (omit.includes(k) || v === "" || v === false) continue;
    p.set(k, v === true ? "1" : v);
  }
  return p.toString();
}

/** Same semantics as the original static site: text match on name/city/country/cuisine; price is strictly below `max`. */
export function filterRestaurants(list: Restaurant[], f: Filters, locale: Locale): Restaurant[] {
  const q = normalize(f.q.trim(), locale);
  const out = list.filter((r) =>
    (!q || normalize([r.name, r.city.name.en, r.city.name.it, r.city.country.it, r.city.country.en, r.cuisine.name.en, r.cuisine.name.it].join(" "), locale).includes(q)) &&
    (!f.city || r.city.slug === f.city) &&
    (!f.cuisine || r.cuisine.key === f.cuisine) &&
    (!f.level || r.level === Number(f.level)) &&
    (!f.max || r.price < Number(f.max)) &&
    (!f.rooms || r.rooms),
  );
  if (f.sort === "price") out.sort((a, b) => a.price - b.price);
  if (f.sort === "high") out.sort((a, b) => b.price - a.price);
  if (f.sort === "name") out.sort((a, b) => a.name.localeCompare(b.name, locale));
  return out;
}

export const hasActiveFilters = (f: Filters) => Boolean(f.q || f.city || f.cuisine || f.level || f.max || f.rooms);
