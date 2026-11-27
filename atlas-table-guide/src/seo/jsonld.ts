import { BRAND, SITE_URL, type Locale } from "@/config/brand";
import type { Article, Chef, City, Country, Experience, GiftCard, Hotel, Itinerary, Restaurant } from "@/db/types";
import { t } from "@/db/types";
import { menuPrice, priceBand, priceRangeLabel, usable } from "@/lib/price";
import { SITE } from "@/config/site";

/** JSON-LD node (loosely typed, validated by validateJsonLd()). */
export type Node = { "@type": string | string[]; [k: string]: unknown };

/** Per-type allow-lists. Anything else is a build/test failure (no boilerplate props). */
export const ALLOWED: Record<string, readonly string[]> = {
  Organization: ["@context", "@type", "@id", "name", "url", "logo", "email", "legalName", "description", "sameAs"],
  WebSite: ["@context", "@type", "@id", "name", "url", "inLanguage", "publisher", "potentialAction"],
  SearchAction: ["@type", "target", "query-input"],
  EntryPoint: ["@type", "urlTemplate"],
  BreadcrumbList: ["@context", "@type", "itemListElement"],
  ListItem: ["@type", "position", "name", "item", "url"],
  ItemList: ["@context", "@type", "name", "numberOfItems", "itemListElement", "itemListOrder"],
  Restaurant: ["@context", "@type", "@id", "name", "url", "image", "description", "servesCuisine", "priceRange", "telephone", "email", "address", "geo", "openingHoursSpecification", "specialOpeningHoursSpecification", "aggregateRating", "hasMenu", "acceptsReservations", "amenityFeature", "award", "employee", "sameAs", "containedInPlace"],
  Hotel: ["@context", "@type", "@id", "name", "url", "image", "description", "address", "geo", "amenityFeature", "numberOfRooms", "priceRange", "containsPlace", "aggregateRating"],
  Product: ["@context", "@type", "@id", "name", "url", "image", "description", "offers", "brand", "category"],
  Offer: ["@type", "price", "priceCurrency", "url", "availability", "category", "description", "name", "seller"],
  AggregateOffer: ["@type", "lowPrice", "highPrice", "priceCurrency", "offerCount"],
  PostalAddress: ["@type", "streetAddress", "postalCode", "addressLocality", "addressRegion", "addressCountry"],
  GeoCoordinates: ["@type", "latitude", "longitude"],
  OpeningHoursSpecification: ["@type", "dayOfWeek", "opens", "closes", "validFrom", "validThrough"],
  Menu: ["@type", "name", "hasMenuSection", "hasMenuItem", "offers", "inLanguage"],
  MenuSection: ["@type", "name", "hasMenuItem", "offers"],
  MenuItem: ["@type", "name", "description", "offers"],
  LocationFeatureSpecification: ["@type", "name", "value"],
  Person: ["@context", "@type", "@id", "name", "jobTitle", "url", "description", "worksFor"],
  City: ["@type", "name", "url"],
  Place: ["@context", "@type", "@id", "name", "url", "description", "geo", "address", "containedInPlace", "image"],
  Country: ["@type", "name"],
  Article: ["@context", "@type", "@id", "headline", "description", "image", "datePublished", "dateModified", "author", "publisher", "mainEntityOfPage", "inLanguage", "articleSection", "about", "isAccessibleForFree", "sponsor"],
  FAQPage: ["@context", "@type", "mainEntity"],
  Question: ["@type", "name", "acceptedAnswer"],
  Answer: ["@type", "text"],
  AggregateRating: ["@type", "ratingValue", "reviewCount", "bestRating", "worstRating"],
  TouristTrip: ["@context", "@type", "@id", "name", "description", "url", "image", "itinerary", "offers", "touristType"],
  ImageObject: ["@type", "url", "width", "height"],
};

/** Properties that must never appear anywhere (benchmark-directory boilerplate / invalid shapes). */
export const FORBIDDEN_ANYWHERE = ["hasDriveThroughService", "smokingAllowed", "paymentAccepted_boilerplate"];

export function validateJsonLd(node: unknown, path = "$"): string[] {
  const errors: string[] = [];
  if (Array.isArray(node)) {
    node.forEach((n, i) => errors.push(...validateJsonLd(n, `${path}[${i}]`)));
    return errors;
  }
  if (!node || typeof node !== "object") return errors;
  const obj = node as Record<string, unknown>;
  const type = obj["@type"];
  const types = Array.isArray(type) ? (type as string[]) : type ? [String(type)] : [];
  for (const ty of types) {
    const allowed = ALLOWED[ty];
    if (!allowed) errors.push(`${path}: unknown @type "${ty}"`);
    else for (const k of Object.keys(obj)) if (!allowed.includes(k)) errors.push(`${path}: property "${k}" not allowed on ${ty}`);
  }
  for (const k of Object.keys(obj)) {
    if (FORBIDDEN_ANYWHERE.includes(k)) errors.push(`${path}: forbidden property "${k}"`);
    if ((k === "latitude" || k === "longitude") && !types.includes("GeoCoordinates")) errors.push(`${path}: flat ${k} outside GeoCoordinates`);
    if (obj[k] === undefined || obj[k] === null || obj[k] === "") errors.push(`${path}.${k}: empty value`);
    errors.push(...validateJsonLd(obj[k], `${path}.${k}`));
  }
  if (types.includes("ListItem") && typeof obj.position !== "number") errors.push(`${path}: ListItem without numeric position`);
  return errors;
}

/** Drop undefined/null/empty values and empty arrays so builders never emit placeholders. */
export function clean<T>(v: T): T {
  if (Array.isArray(v)) return v.map(clean).filter((x) => x !== undefined) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      const c = clean(x);
      if (c === undefined || c === null || c === "" || (Array.isArray(c) && c.length === 0)) continue;
      out[k] = c;
    }
    return out as T;
  }
  return v;
}

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

export function buildOrganizationJsonLd(): Node {
  return clean({
    "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#organization`,
    name: BRAND.name, url: SITE_URL, logo: abs("/favicon.svg"), email: BRAND.supportEmail,
    legalName: BRAND.legalEntity === "TO BE COMPLETED" ? undefined : BRAND.legalEntity,
  });
}

export function buildWebsiteJsonLd(locale: Locale): Node {
  return {
    "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: BRAND.name, url: `${SITE_URL}/${locale}/`, inLanguage: locale,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.name } as unknown as Node,
    potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/${locale}/restaurants/?q={search_term_string}` }, "query-input": "required name=search_term_string" },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]): Node {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function buildItemListJsonLd(name: string, items: { name: string; path: string }[]): Node {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name, numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(it.path), name: it.name })),
  };
}

export function buildFaqJsonLd(qas: { q: string; a: string }[]): Node {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qas.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) };
}

const DAY_URI = (d: string) => `https://schema.org/${d}`;
const AMENITY_FEATURES: [keyof Restaurant["features"], string][] = [["terrace", "Terrace"], ["seaView", "Sea view"], ["parking", "Parking"], ["accessible", "Wheelchair accessible"], ["privateDining", "Private dining room"]];

export type RestaurantCtx = { locale: Locale; city: City; country: Country; chef?: Chef; cuisineNames: string[]; imageUrls: string[]; eurLowest: number | null };

/** Typed, allow-listed Restaurant builder. Geo is always nested; aggregateRating only from first-party reviews. */
export function buildRestaurantJsonLd(r: Restaurant, ctx: RestaurantCtx): Node {
  const url = `${SITE_URL}/${ctx.locale}/restaurant/${r.slug}/`;
  const verifiedMenus = r.menus.filter((m) => usable(m) && m.status === "verified");
  const tastingMenus = verifiedMenus.filter((m) => m.kind === "tasting");
  const wine = menuPrice(r, "wine_pairing");
  const band = priceBand(ctx.eurLowest);
  const anyVerifiedPrice = tastingMenus.length > 0;
  return clean({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}#restaurant`,
    name: r.name,
    url,
    image: ctx.imageUrls.map(abs),
    description: t(r.description, ctx.locale),
    servesCuisine: ctx.cuisineNames,
    priceRange: anyVerifiedPrice && band ? priceRangeLabel(band) : undefined,
    telephone: r.phone,
    email: r.email,
    address: { "@type": "PostalAddress", streetAddress: r.address.street, postalCode: r.address.postalCode, addressLocality: r.address.locality, addressRegion: r.address.region, addressCountry: r.address.countryCode },
    geo: { "@type": "GeoCoordinates", latitude: r.lat, longitude: r.lng },
    openingHoursSpecification: r.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days.map(DAY_URI), opens: h.opens, closes: h.closes, validFrom: h.validFrom, validThrough: h.validThrough })),
    specialOpeningHoursSpecification: r.specialHours.filter((s) => s.closed).map((s) => ({ "@type": "OpeningHoursSpecification", validFrom: s.date, validThrough: s.date, opens: "00:00", closes: "00:00" })),
    aggregateRating: r.reviews.count >= SITE.minReviewsForRating && r.reviews.average != null ? { "@type": "AggregateRating", ratingValue: r.reviews.average, reviewCount: r.reviews.count, bestRating: 5, worstRating: 1 } : undefined,
    hasMenu: tastingMenus.length
      ? {
          "@type": "Menu", name: "Tasting menus", inLanguage: ctx.locale,
          hasMenuSection: tastingMenus.map((m) => ({
            "@type": "MenuSection", name: t(m.name, ctx.locale),
            offers: { "@type": "Offer", price: m.amount, priceCurrency: m.currency },
          })).concat(wine && wine.status === "verified" && usable(wine) ? [{ "@type": "MenuSection", name: t(wine.name, ctx.locale), offers: { "@type": "Offer", price: wine.amount, priceCurrency: wine.currency } }] : []),
        }
      : undefined,
    acceptsReservations: true,
    amenityFeature: AMENITY_FEATURES.filter(([k]) => r.features[k]).map(([, name]) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    // Real awards only (stored with source). Demo levels are never emitted.
    award: r.awards.length ? r.awards.map((a) => `${a.title} (${a.body}, ${a.year})`) : undefined,
    employee: ctx.chef ? { "@type": "Person", name: ctx.chef.name, jobTitle: "Head chef", url: `${SITE_URL}/${ctx.locale}/chefs/${ctx.chef.slug}/` } : undefined,
    sameAs: r.website && !r.isDemo ? [r.website] : undefined,
    containedInPlace: { "@type": "City", name: t(ctx.city.name, ctx.locale), url: `${SITE_URL}/${ctx.locale}/restaurants/${ctx.country.slug}/${ctx.city.slug}/` },
  });
}

export function buildHotelJsonLd(h: Hotel, ctx: { locale: Locale; imageUrls: string[]; restaurants: { name: string; slug: string }[] }): Node {
  const url = `${SITE_URL}/${ctx.locale}/hotel/${h.slug}/`;
  return clean({
    "@context": "https://schema.org", "@type": "Hotel", "@id": `${url}#hotel`, name: h.name, url, image: ctx.imageUrls.map(abs),
    description: t(h.description, ctx.locale),
    address: { "@type": "PostalAddress", streetAddress: h.isDemo ? undefined : h.address.street, postalCode: h.address.postalCode, addressLocality: h.address.locality, addressCountry: h.address.countryCode },
    geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng },
    amenityFeature: h.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    numberOfRooms: h.rooms,
    containsPlace: ctx.restaurants.map((r) => ({ "@type": "Restaurant", name: r.name, url: `${SITE_URL}/${ctx.locale}/restaurant/${r.slug}/` })),
  });
}

export function buildExperienceJsonLd(x: Experience, ctx: { locale: Locale; imageUrls: string[] }): Node {
  const url = `${SITE_URL}/${ctx.locale}/experience/${x.slug}/`;
  return clean({
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, name: x.name, url, image: ctx.imageUrls.map(abs),
    description: t(x.description, ctx.locale), category: x.category,
    offers: x.price && x.price.status === "verified" ? { "@type": "Offer", price: x.price.amount, priceCurrency: x.price.currency, url } : undefined,
  });
}

export function buildGiftCardJsonLd(g: GiftCard, locale: Locale): Node {
  return clean({
    "@context": "https://schema.org", "@type": "Product", "@id": `${SITE_URL}/${locale}/gifts/#${g.slug}`, name: t(g.name, locale), description: t(g.description, locale),
    brand: { "@type": "Organization", name: BRAND.name } as unknown as Node, category: "Gift card",
    offers: { "@type": "AggregateOffer", lowPrice: Math.min(...g.values), highPrice: Math.max(...g.values), priceCurrency: g.currency, offerCount: g.values.length },
  });
}

export function buildArticleJsonLd(a: Article, ctx: { locale: Locale; imageUrl: string }): Node {
  const url = `${SITE_URL}/${ctx.locale}/magazine/${a.slug}/`;
  return clean({
    "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: t(a.title, ctx.locale), description: t(a.excerpt, ctx.locale),
    image: [abs(ctx.imageUrl)], datePublished: a.publishedAt, dateModified: a.updatedAt, inLanguage: ctx.locale, articleSection: a.category,
    author: { "@type": "Person", name: a.author.name, jobTitle: a.author.role },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.name, logo: abs("/favicon.svg") } as unknown as Node,
    mainEntityOfPage: url,
    sponsor: a.sponsored && a.sponsor ? { "@type": "Organization", name: a.sponsor } : undefined,
  });
}

export function buildPlaceJsonLd(city: City, country: Country, locale: Locale, path: string, imageUrl: string): Node {
  return clean({
    "@context": "https://schema.org", "@type": "Place", "@id": `${abs(path)}#place`, name: t(city.name, locale), url: abs(path), description: t(city.intro, locale),
    geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng }, image: abs(imageUrl),
    containedInPlace: { "@type": "Country", name: t(country.name, locale) },
  });
}

export function buildItineraryJsonLd(it: Itinerary, ctx: { locale: Locale; imageUrl: string; stops: { name: string; path: string }[] }): Node {
  const url = `${SITE_URL}/${ctx.locale}/travel/${it.slug}/`;
  return clean({
    "@context": "https://schema.org", "@type": "TouristTrip", "@id": `${url}#trip`, name: t(it.title, ctx.locale), description: t(it.summary, ctx.locale), url, image: abs(ctx.imageUrl),
    touristType: "Food lovers",
    itinerary: { "@type": "ItemList", numberOfItems: ctx.stops.length, itemListElement: ctx.stops.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: abs(s.path) })) },
  });
}

export function buildChefJsonLd(chef: Chef, ctx: { locale: Locale; restaurants: { name: string; slug: string }[] }): Node {
  const url = `${SITE_URL}/${ctx.locale}/chefs/${chef.slug}/`;
  return clean({
    "@context": "https://schema.org", "@type": "Person", "@id": `${url}#person`, name: chef.name, jobTitle: "Chef", url, description: t(chef.bio, ctx.locale),
    worksFor: ctx.restaurants.map((r) => ({ "@type": "Restaurant", name: r.name, url: `${SITE_URL}/${ctx.locale}/restaurant/${r.slug}/` })),
  });
}
