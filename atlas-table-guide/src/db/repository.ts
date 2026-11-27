import { cache } from "react";
import { SITE } from "@/config/site";
import type { Dataset } from "./types";
import { demoDataset } from "./demo";
import { loadSupabaseDataset } from "./supabase";

/**
 * Returns the published dataset. Sources:
 *  1. Supabase (when NEXT_PUBLIC_SUPABASE_URL + anon key are set) — published rows only (RLS).
 *  2. Bundled demo seed (is_demo = true) — only when ALLOW_DEMO_DATA !== "false".
 * Both are merged; demo rows are dropped entirely when demo data is disallowed.
 */
export const getDataset = cache(async (): Promise<Dataset> => {
  const remote = await loadSupabaseDataset().catch((e) => {
    console.error("[repository] Supabase load failed, falling back", e);
    return null;
  });
  const base = remote ?? emptyDataset();
  const merged = SITE.allowDemoData ? mergeDatasets(base, demoDataset()) : base;
  return filterPublished(merged, SITE.allowDemoData);
});

export function emptyDataset(): Dataset {
  return { source: "supabase", countries: [], regions: [], cities: [], chefs: [], cuisines: [], restaurants: [], hotels: [], experiences: [], itineraries: [], articles: [], giftCards: [], affiliateLinks: [] };
}

function mergeDatasets(a: Dataset, b: Dataset): Dataset {
  const m = <T extends { slug: string }>(x: T[], y: T[]) => [...x, ...y.filter((i) => !x.some((j) => j.slug === i.slug))];
  return {
    source: a.restaurants.length ? "supabase" : "demo",
    countries: m(a.countries, b.countries),
    regions: m(a.regions, b.regions),
    cities: m(a.cities, b.cities),
    chefs: m(a.chefs, b.chefs),
    cuisines: m(a.cuisines, b.cuisines),
    restaurants: m(a.restaurants, b.restaurants),
    hotels: m(a.hotels, b.hotels),
    experiences: m(a.experiences, b.experiences),
    itineraries: m(a.itineraries, b.itineraries),
    articles: m(a.articles, b.articles),
    giftCards: m(a.giftCards, b.giftCards),
    affiliateLinks: [...a.affiliateLinks, ...b.affiliateLinks.filter((l) => !a.affiliateLinks.some((x) => x.id === l.id))],
  };
}

/** Pure: keep published rows; drop demo rows when not allowed. Exported for tests. */
export function filterPublished(d: Dataset, allowDemo: boolean): Dataset {
  const ok = <T extends { publicationStatus: string; isDemo: boolean }>(rows: T[]) => rows.filter((r) => r.publicationStatus === "published" && (allowDemo || !r.isDemo));
  return {
    ...d,
    countries: ok(d.countries),
    regions: ok(d.regions),
    cities: ok(d.cities),
    chefs: ok(d.chefs),
    restaurants: ok(d.restaurants),
    hotels: ok(d.hotels),
    experiences: ok(d.experiences),
    itineraries: ok(d.itineraries),
    articles: ok(d.articles),
    giftCards: ok(d.giftCards),
    affiliateLinks: allowDemo ? d.affiliateLinks : d.affiliateLinks.filter((l) => !l.url.includes("/demo-affiliate/")),
  };
}
