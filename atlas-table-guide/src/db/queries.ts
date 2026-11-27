import type { Dataset, Restaurant } from "./types";
import { t } from "./types";
import type { Locale } from "@/config/brand";
import { haversine } from "@/lib/geo";
import { lowestEUR } from "@/lib/filters";
import type { Rates } from "@/lib/price";
import { tastingMenus } from "@/lib/price";
import type { Collection } from "./types";
import { SITE } from "@/config/site";
import { daysSince } from "@/lib/format";

export const cityOf = (d: Dataset, slug: string) => d.cities.find((c) => c.slug === slug);
export const countryOf = (d: Dataset, slug: string) => d.countries.find((c) => c.slug === slug);
export const regionOf = (d: Dataset, slug: string) => d.regions.find((c) => c.slug === slug);
export const chefOf = (d: Dataset, slug?: string) => (slug ? d.chefs.find((c) => c.slug === slug) : undefined);
export const restaurantOf = (d: Dataset, slug: string) => d.restaurants.find((r) => r.slug === slug);
export const hotelOf = (d: Dataset, slug: string) => d.hotels.find((r) => r.slug === slug);
export const experienceOf = (d: Dataset, slug: string) => d.experiences.find((r) => r.slug === slug);
export const cuisineName = (d: Dataset, slug: string, locale: Locale) => t(d.cuisines.find((c) => c.slug === slug)?.name, locale) || slug;

/** Effective verification status, applying the staleness window. */
export function effectiveVerification(r: { verificationStatus: string; lastVerifiedAt?: string }, now = new Date()) {
  if (r.verificationStatus === "verified") {
    const days = daysSince(r.lastVerifiedAt, now);
    if (days == null || days > SITE.staleAfterDays) return "stale";
  }
  return r.verificationStatus;
}

export const isVerified = (r: Restaurant) => effectiveVerification(r) === "verified";

export function restaurantsIn(d: Dataset, scope: { country?: string; region?: string; city?: string }) {
  return d.restaurants.filter((r) => (!scope.country || r.countrySlug === scope.country) && (!scope.region || r.regionSlug === scope.region) && (!scope.city || r.citySlug === scope.city));
}

export function nearby<T extends { lat: number; lng: number; slug: string }>(items: T[], from: { lat: number; lng: number; slug?: string }, maxKm = 40, limit = 3): T[] {
  return items
    .filter((i) => i.slug !== from.slug)
    .map((i) => ({ i, d: haversine(from, i) }))
    .filter((x) => x.d <= maxKm * 1000)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.i);
}

export function similarRestaurants(d: Dataset, r: Restaurant, limit = 3): Restaurant[] {
  return d.restaurants
    .filter((x) => x.slug !== r.slug)
    .map((x) => ({ x, s: (x.citySlug === r.citySlug ? 3 : 0) + x.cuisines.filter((c) => r.cuisines.includes(c)).length * 2 + (x.recognition.level === r.recognition.level ? 1 : 0) }))
    .sort((a, b) => b.s - a.s || a.x.name.localeCompare(b.x.name))
    .slice(0, limit)
    .map((a) => a.x);
}

/** Verified tasting-menu prices (original currency) for a set of restaurants. */
export function verifiedTastingPrices(list: Restaurant[]) {
  return list.flatMap((r) => tastingMenus(r).filter((m) => m.status === "verified").map((m) => ({ r, m })));
}

export function collectionMembers(d: Dataset, c: Collection, rates: Rates | null): Restaurant[] {
  const rule = c.rule;
  return d.restaurants.filter((r) => {
    switch (rule.type) {
      case "recognition":
        return r.recognition.level === rule.level;
      case "feature":
        return r.features[rule.feature];
      case "winePairing":
        return r.menus.some((m) => m.kind === "wine_pairing" && m.status === "verified" && m.amount != null);
      case "maxPrice": {
        const verified = r.menus.filter((m) => m.kind === "tasting" && m.status === "verified" && m.amount != null);
        return verified.some((m) => { const e = lowestEUR({ ...r, menus: [m] }, rates); return e != null && e <= rule.amount; });
      }
      case "affordableRecognised": {
        if (r.recognition.level < 1) return false;
        const e = lowestEUR({ ...r, menus: r.menus.filter((m) => m.status === "verified") }, rates);
        return e != null && e <= rule.amount;
      }
    }
  });
}

export function itinerariesFeaturing(d: Dataset, slug: string) {
  return d.itineraries.filter((it) => it.days.some((day) => day.items.some((i) => i.ref === slug)));
}
