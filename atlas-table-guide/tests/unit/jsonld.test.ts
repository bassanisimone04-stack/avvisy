import { describe, expect, it } from "vitest";
import { buildRestaurantJsonLd, buildHotelJsonLd, buildItemListJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, buildFaqJsonLd, buildWebsiteJsonLd, buildOrganizationJsonLd, buildExperienceJsonLd, buildPlaceJsonLd, validateJsonLd, FORBIDDEN_ANYWHERE } from "@/seo/jsonld";
import { demoDataset } from "@/db/demo";

const d = demoDataset();
const r = d.restaurants.find((x) => x.slug === "maison-lune-paris")!;
const city = d.cities.find((c) => c.slug === r.citySlug)!;
const country = d.countries.find((c) => c.slug === r.countrySlug)!;
const ctx = { locale: "en" as const, city, country, chef: d.chefs.find((c) => c.slug === r.chefSlug), cuisineNames: ["French"], imageUrls: ["/images/x.webp"], eurLowest: 145 };
const json = (o: unknown) => JSON.stringify(o);

describe("buildRestaurantJsonLd", () => {
  const node = buildRestaurantJsonLd(r, ctx) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  it("is valid against the allow-list", () => expect(validateJsonLd(node)).toEqual([]));
  it("nests coordinates in GeoCoordinates (never flat)", () => {
    expect(node.geo).toEqual({ "@type": "GeoCoordinates", latitude: r.lat, longitude: r.lng });
    expect(node.latitude).toBeUndefined();
    expect(node.longitude).toBeUndefined();
  });
  it("emits OpeningHoursSpecification from structured hours", () => {
    expect(node.openingHoursSpecification[0]).toMatchObject({ "@type": "OpeningHoursSpecification", opens: "12:00", closes: "14:00" });
    expect(node.openingHoursSpecification[0].dayOfWeek).toContain("https://schema.org/Tuesday");
  });
  it("uses absolute image URLs and a full PostalAddress", () => {
    expect(node.image[0]).toMatch(/^https:\/\//);
    expect(node.address).toMatchObject({ "@type": "PostalAddress", addressCountry: "FR", postalCode: "75006" });
  });
  it("omits aggregateRating without first-party reviews", () => expect(node.aggregateRating).toBeUndefined());
  it("never emits demo distinctions as awards", () => expect(node.award).toBeUndefined());
  it("never contains irrelevant boilerplate props", () => {
    for (const p of FORBIDDEN_ANYWHERE) expect(json(node)).not.toContain(p);
  });
  it("includes verified menu offers with currency", () => {
    expect(node.hasMenu.hasMenuSection.some((s: { offers: { priceCurrency: string } }) => s.offers.priceCurrency === "EUR")).toBe(true);
  });
  it("emits real awards with year when sourced", () => {
    const real = { ...r, isDemo: false, awards: [{ body: "Example Guide", title: "One distinction", year: 2025, level: 1 as const, sourceUrl: "https://example.org" }] };
    expect((buildRestaurantJsonLd(real, ctx) as Record<string, unknown>).award).toEqual(["One distinction (Example Guide, 2025)"]);
  });
  it("adds aggregateRating only above the review threshold", () => {
    const reviewed = { ...r, reviews: { count: 25, average: 4.6 } };
    expect((buildRestaurantJsonLd(reviewed, ctx) as Record<string, unknown>).aggregateRating).toMatchObject({ ratingValue: 4.6, reviewCount: 25 });
  });
});

describe("validateJsonLd", () => {
  it("flags flat lat/long, unknown props and forbidden props", () => {
    const errs = validateJsonLd({ "@type": "Restaurant", name: "x", latitude: 1, longitude: 2, hasDriveThroughService: false });
    expect(errs.join("\n")).toMatch(/flat latitude/);
    expect(errs.join("\n")).toMatch(/hasDriveThroughService/);
  });
  it("flags ListItem without position", () => expect(validateJsonLd({ "@type": "ListItem", name: "x" }).join()).toMatch(/position/));
});

describe("other builders validate", () => {
  it.each([
    ["ItemList", buildItemListJsonLd("Best", [{ name: "A", path: "/en/restaurant/a/" }, { name: "B", path: "/en/restaurant/b/" }])],
    ["BreadcrumbList", buildBreadcrumbJsonLd([{ name: "Home", path: "/en/" }, { name: "Restaurants", path: "/en/restaurants/" }])],
    ["FAQPage", buildFaqJsonLd([{ q: "Q?", a: "A." }])],
    ["WebSite", buildWebsiteJsonLd("en")],
    ["Organization", buildOrganizationJsonLd()],
    ["Hotel", buildHotelJsonLd(d.hotels[0]!, { locale: "en", imageUrls: ["/i.webp"], restaurants: [{ name: "R", slug: "r" }] })],
    ["Product", buildExperienceJsonLd(d.experiences[1]!, { locale: "en", imageUrls: ["/i.webp"] })],
    ["Article", buildArticleJsonLd(d.articles[0]!, { locale: "en", imageUrl: "/i.webp" })],
    ["Place", buildPlaceJsonLd(city, country, "en", "/en/restaurants/france/paris/", "/i.webp")],
  ])("%s", (_name, node) => expect(validateJsonLd(node)).toEqual([]));
  it("ItemList positions are 1-based and sequential", () => {
    const n = buildItemListJsonLd("x", [{ name: "a", path: "/a" }, { name: "b", path: "/b" }]) as { itemListElement: { position: number }[] };
    expect(n.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
  it("hotel geo is nested", () => expect(json(buildHotelJsonLd(d.hotels[0]!, { locale: "en", imageUrls: [], restaurants: [] }))).toContain('"geo":{"@type":"GeoCoordinates"'));
});
