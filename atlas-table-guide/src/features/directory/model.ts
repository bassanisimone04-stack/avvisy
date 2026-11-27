import type { Locale } from "@/config/brand";
import type { Dataset } from "@/db/types";
import { t } from "@/db/types";
import { fmt } from "@/i18n";
import type { Dict } from "@/i18n/en";
import { applyFilters, facetCounts, paginate, parseFilters, sortRestaurants, type Filters } from "@/lib/filters";
import type { Rates } from "@/lib/price";
import { SITE } from "@/config/site";
import { cityOf, countryOf, isVerified, regionOf, restaurantsIn, verifiedTastingPrices } from "@/db/queries";
import { facetIndexability, passesQualityGate, type HubKind } from "@/seo/indexable-facets";
import { formatMoney } from "@/lib/price";
import { formatDate } from "@/lib/format";

export type Scope = { kind: HubKind; country?: string; region?: string; city?: string };
type SP = Record<string, string | string[] | undefined>;

/** Resolve /restaurants/{country}/{place} where place may be a region or a city. */
export function resolveScope(d: Dataset, country?: string, place?: string): Scope | null {
  if (!country) return { kind: "global" };
  if (!countryOf(d, country)) return null;
  if (!place) return { kind: "country", country };
  const city = d.cities.find((c) => c.slug === place && c.countrySlug === country);
  if (city) return { kind: "city", country, city: city.slug, region: undefined };
  const region = d.regions.find((r) => r.slug === place && r.countrySlug === country);
  if (region) return { kind: "region", country, region: region.slug };
  return null;
}

export function hubModel(d: Dataset, rates: Rates, locale: Locale, dict: Dict, scope: Scope, sp: SP) {
  const path = scope.kind === "global" ? "/restaurants/" : scope.kind === "country" ? `/restaurants/${scope.country}/` : `/restaurants/${scope.country}/${scope.city ?? scope.region}/`;
  const hubPath = `/${locale}${path}`;
  const country = scope.country ? countryOf(d, scope.country) : undefined;
  const city = scope.city ? cityOf(d, scope.city) : undefined;
  const region = scope.region ? regionOf(d, scope.region) : undefined;
  const placeName = city ? t(city.name, locale) : region ? t(region.name, locale) : country ? t(country.name, locale) : "";
  const base = restaurantsIn(d, scope);
  const f: Filters = { ...parseFilters(sp), country: scope.country, region: scope.region, city: scope.city };
  const cuisineName = (slug: string) => t(d.cuisines.find((c) => c.slug === slug)?.name, locale);
  const results = sortRestaurants(applyFilters(base, f, rates, (r) => `${t(cityOf(d, r.citySlug)?.name, "en")} ${t(cityOf(d, r.citySlug)?.name, "it")} ${r.cuisines.map((c) => `${t(d.cuisines.find((x) => x.slug === c)?.name, "en")}`).join(" ")}`), f, rates);
  const page = paginate(results, f.page, SITE.pageSize);
  const verified = base.filter(isVerified);
  const recognised = base.filter((r) => r.recognition.level > 0);
  const intro = city ? t(city.intro, locale) : "";
  const gate = scope.kind === "global" ? true : scope.kind === "city" ? passesQualityGate(verified.length, !!intro) : verified.length >= SITE.destinationMinVerified;
  const paramKeys: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) paramKeys[k] = Array.isArray(v) ? v.join(",") : v;
  const facetVerified = scope.kind === "city" && typeof sp.cuisine === "string" ? verified.filter((r) => r.cuisines.includes(sp.cuisine as string)).length : 0;
  const decision = facetIndexability({ hubPath, kind: scope.kind, params: paramKeys, hubPassesQualityGate: gate, facetVerifiedCount: facetVerified });
  const h1 = scope.kind === "global" ? dict.directory.h1 : fmt(scope.kind === "country" ? dict.directory.h1Country : dict.directory.h1Place, { place: placeName });
  const prices = verifiedTastingPrices(base);
  const priceRange = (() => {
    if (prices.length < SITE.priceIndexMinSample) return null;
    const cur = prices[0]!.m.currency;
    const same = prices.filter((p) => p.m.currency === cur).map((p) => p.m.amount!);
    if (same.length < SITE.priceIndexMinSample) return null;
    return { min: formatMoney(Math.min(...same), cur, locale), max: formatMoney(Math.max(...same), cur, locale), n: same.length, date: formatDate(prices.map((p) => p.m.collectedAt).filter(Boolean).sort().at(-1), locale) };
  })();
  const lastVerified = formatDate(verified.map((r) => r.lastVerifiedAt).filter(Boolean).sort().at(-1), locale);
  const answer = placeName
    ? priceRange
      ? fmt(dict.directory.answer, { place: placeName, n: base.length, rec: recognised.length ? fmt(dict.directory.answerRec, { r: recognised.length }) : "", min: priceRange.min, max: priceRange.max, date: lastVerified })
      : fmt(dict.directory.answerNoPrice, { place: placeName, n: base.length })
    : "";
  const faq = placeName
    ? [
        { q: fmt(dict.directory.faq.price, { place: placeName }), a: priceRange ? fmt(dict.directory.faq.priceA, { min: priceRange.min, max: priceRange.max, n: priceRange.n, date: priceRange.date }) : fmt(dict.directory.faq.priceNA, { n: prices.length }) },
        { q: fmt(dict.directory.faq.count, { place: placeName }), a: fmt(dict.directory.faq.countA, { n: base.length, place: placeName, r: recognised.length }) },
        ...(city ? [{ q: dict.directory.faq.book, a: t(city.bestTimeToBook, locale) }] : []),
      ]
    : [];
  const breadcrumbs = [
    { name: dict.common.home, path: `/${locale}/` },
    { name: dict.nav.restaurants, path: `/${locale}/restaurants/` },
    ...(country ? [{ name: t(country.name, locale), path: `/${locale}/restaurants/${country.slug}/` }] : []),
    ...(city || region ? [{ name: placeName, path: hubPath }] : []),
  ];
  return {
    path, hubPath, scope, f, base, results, page, counts: facetCounts(base), h1, placeName, intro, answer, faq, decision, gate, breadcrumbs,
    cuisineOptions: [...new Set(base.flatMap((r) => r.cuisines))].map((slug) => ({ slug, name: cuisineName(slug), count: base.filter((r) => r.cuisines.includes(slug)).length })).sort((a, b) => b.count - a.count),
    city, country, region,
  };
}
