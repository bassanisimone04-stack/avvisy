import { describe, expect, it } from "vitest";
import { cities, cuisines, restaurants, findRestaurant, title } from "@/data/catalog";
import { COMPARE_MAX, compareHref, parseCompare } from "@/lib/compare";
import { money, normalize, other, url } from "@/lib/i18n";
import { existsSync } from "node:fs";

describe("demo catalogue", () => {
  it("keeps the original public URLs atlas-1 … atlas-30", () => {
    expect(restaurants.map((r) => r.slug)).toEqual(Array.from({ length: 30 }, (_, i) => `atlas-${i + 1}`));
  });
  it("has 10 destinations and 4 cuisines, in both languages", () => {
    expect(cities).toHaveLength(10);
    expect(cuisines).toHaveLength(4);
    expect(cities.every((c) => c.name.it && c.name.en && c.country.it && c.country.en)).toBe(true);
  });
  it("flags every venue as a demo and never claims a real award", () => {
    expect(restaurants.every((r) => r.isDemo === true)).toBe(true);
    expect(restaurants.every((r) => [1, 2, 3].includes(r.level))).toBe(true);
  });
  it("every image referenced exists in /public/assets", () => {
    const names = new Set([...restaurants.map((r) => r.image), ...cities.map((c) => c.slug), "hero", "tuscany", "tasting", "dining", "lake", "wine", "plate1", "plate2"]);
    for (const n of names) expect(existsSync(new URL(`../../public/assets/${n}.webp`, import.meta.url)), n).toBe(true);
  });
  it("prices are plausible and stable", () => {
    expect(restaurants[0]!.price).toBe(65);
    expect(restaurants.every((r) => r.price >= 65 && r.price < 300)).toBe(true);
    expect(findRestaurant("atlas-7")?.name).toBe("Corte di Sale");
  });
  it("section titles exist in both languages", () => { expect(title("restaurants", "it")).toBe("Ristoranti"); expect(title("restaurants", "en")).toBe("Restaurants"); });
});

describe("compare links", () => {
  it("parses unique valid slugs, max four", () => expect(parseCompare("atlas-1,atlas-2,atlas-1,atlas-3,atlas-4,atlas-5")).toEqual(["atlas-1", "atlas-2", "atlas-3", "atlas-4"]));
  it("drops invalid slugs", () => expect(parseCompare("atlas-1,<script>,../x,ATLAS-2")).toEqual(["atlas-1", "atlas-2"]));
  it("handles empty input", () => { expect(parseCompare(null)).toEqual([]); expect(parseCompare("")).toEqual([]); });
  it("builds the shareable URL used by the original site", () => { expect(compareHref("it", ["atlas-1", "atlas-2"])).toBe("/it/compare/?r=atlas-1%2Catlas-2"); expect(COMPARE_MAX).toBe(4); });
});

describe("i18n helpers", () => {
  it("builds locale URLs with a trailing slash", () => { expect(url("it")).toBe("/it/"); expect(url("en", "restaurants")).toBe("/en/restaurants/"); expect(url("it", "/restaurant/atlas-1/")).toBe("/it/restaurant/atlas-1/"); });
  it("switches language", () => { expect(other("it")).toBe("en"); expect(other("en")).toBe("it"); });
  it("formats euros per language", () => { expect(money(65, "en")).toBe("€65"); expect(money(65, "it")).toMatch(/65\s?€/); });
  it("normalises accents", () => expect(normalize("Verre d’Orme Aubépine")).toBe("verre d’orme aubepine"));
});
