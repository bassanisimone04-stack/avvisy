/**
 * Directory data access. Phase 1 reads the fictional demo dataset; Phase 2
 * swaps this implementation for Supabase/PostGIS without touching the UI.
 */
import { demoBusinesses } from "@/data/demo/businesses";
import { distanceMiles } from "./geo";
import type { Business } from "./types";

export function listBusinesses(): Business[] {
  return demoBusinesses;
}

export function getBusiness(slug: string): Business | undefined {
  return demoBusinesses.find((b) => b.slug === slug);
}

export function getNearbyBusinesses(b: Business, limit = 3): Business[] {
  return demoBusinesses
    .filter((x) => x.slug !== b.slug)
    .map((x) => ({ x, d: distanceMiles(b.coordinates, x.coordinates) }))
    .sort((a, z) => a.d - z.d)
    .slice(0, limit)
    .map(({ x }) => x);
}

export function getBusinessesByCategory(categories: string[], limit = 3): Business[] {
  return demoBusinesses.filter((b) => b.categories.some((c) => categories.includes(c))).slice(0, limit);
}

export function directoryStats() {
  const cities = new Set(demoBusinesses.map((b) => `${b.city}, ${b.stateCode}`));
  return { businesses: demoBusinesses.length, cities: cities.size, cityList: [...cities] };
}
