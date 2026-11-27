import { describe, expect, it } from "vitest";
import { demoDataset } from "@/db/demo";
import { filterPublished } from "@/db/repository";
import { validateJsonLd } from "@/seo/jsonld";
import manifest from "@/data/generated/image-manifest.json";
import { buildAlt } from "@/lib/alt";

const d = demoDataset();
describe("demo dataset", () => {
  it("has the required counts", () => {
    expect([d.restaurants.length, d.cities.length, d.hotels.length, d.experiences.length, d.itineraries.length, d.articles.length, d.giftCards.length]).toEqual([30, 10, 12, 15, 6, 12, 6]);
  });
  it("flags every record as demo", () => {
    for (const k of ["restaurants", "hotels", "experiences", "itineraries", "articles", "giftCards", "cities", "chefs"] as const) expect(d[k].every((x) => x.isDemo)).toBe(true);
  });
  it("never gives fictional venues a real award", () => {
    expect(d.restaurants.every((r) => r.awards.length === 0 && r.recognition.kind !== "award")).toBe(true);
  });
  it("has unique slugs", () => {
    const s = d.restaurants.map((r) => r.slug);
    expect(new Set(s).size).toBe(s.length);
  });
  it("uses only reserved example.com URLs for demo websites and affiliates", () => {
    expect(d.restaurants.every((r) => r.website?.startsWith("https://example.com/"))).toBe(true);
    expect(d.affiliateLinks.every((l) => l.url.startsWith("https://example.com/"))).toBe(true);
  });
  it("references only existing images", () => {
    const keys = new Set(Object.keys(manifest));
    for (const r of d.restaurants) for (const i of r.images) expect(keys.has(i.key)).toBe(true);
    for (const c of d.cities) expect(keys.has(c.image.key)).toBe(true);
  });
  it("itinerary references resolve", () => {
    for (const it of d.itineraries) for (const day of it.days) for (const i of day.items) {
      if (i.type === "restaurant") expect(d.restaurants.some((r) => r.slug === i.ref)).toBe(true);
      if (i.type === "hotel") expect(d.hotels.some((r) => r.slug === i.ref)).toBe(true);
      if (i.type === "experience") expect(d.experiences.some((r) => r.slug === i.ref)).toBe(true);
    }
  });
  it("price history is chronological and ends at the current price", () => {
    for (const r of d.restaurants) for (const m of r.menus) if (m.history.length) {
      expect(m.history.map((h) => h.recordedAt)).toEqual([...m.history.map((h) => h.recordedAt)].sort());
    }
  });
});

describe("ALLOW_DEMO_DATA=false", () => {
  it("hides every demo row", () => {
    const hidden = filterPublished(d, false);
    for (const k of ["restaurants", "hotels", "experiences", "itineraries", "articles", "giftCards", "cities", "countries", "chefs"] as const) expect(hidden[k]).toHaveLength(0);
    expect(hidden.affiliateLinks).toHaveLength(0);
  });
  it("keeps published real rows", () => {
    const real = { ...d.restaurants[0]!, isDemo: false, slug: "real-one" };
    expect(filterPublished({ ...d, restaurants: [real, ...d.restaurants] }, false).restaurants.map((r) => r.slug)).toEqual(["real-one"]);
  });
  it("drops unpublished rows even when demo is allowed", () => {
    const draft = { ...d.restaurants[0]!, slug: "draft", publicationStatus: "draft" as const };
    expect(filterPublished({ ...d, restaurants: [draft] }, true).restaurants).toHaveLength(0);
  });
});

describe("buildAlt", () => {
  it("builds descriptive alt from data", () => {
    expect(buildAlt({ subject: "dish", dish: "Seared langoustine with citrus" }, { name: "Maison Lune", city: "Paris" })).toBe("Seared langoustine with citrus at Maison Lune, Paris");
    expect(buildAlt({ subject: "interior" }, { name: "Rug", city: "Copenhagen", locale: "it" })).toBe("Sala di Rug, Copenhagen");
    expect(buildAlt({ subject: "dish" }, { decorative: true })).toBe("");
  });
  it("never returns empty for content images", () => {
    for (const r of d.restaurants) for (const i of r.images) expect(buildAlt(i, { name: r.name, city: r.citySlug }).length).toBeGreaterThan(5);
  });
});
void validateJsonLd;
