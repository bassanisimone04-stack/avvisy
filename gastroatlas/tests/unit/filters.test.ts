import { describe, expect, it } from "vitest";
import { restaurants } from "@/data/catalog";
import { emptyFilters, filterRestaurants, parseFilters, serializeFilters } from "@/lib/filters";

const run = (f: Partial<typeof emptyFilters>, locale: "it" | "en" = "it") => filterRestaurants(restaurants, { ...emptyFilters, ...f }, locale);

describe("filters (same semantics as the original static site)", () => {
  it("returns everything with no filter", () => expect(run({})).toHaveLength(30));
  it("search ignores accents and case", () => {
    expect(run({ q: "aubepine" }).map((r) => r.slug)).toEqual(["atlas-1"]);
    expect(run({ q: "AUBÉPINE" }).map((r) => r.slug)).toEqual(["atlas-1"]);
  });
  it("search matches city and country names in both languages", () => {
    expect(run({ q: "parigi" }).length).toBe(3);
    expect(run({ q: "paris", }, "en").length).toBe(3);
    expect(run({ q: "francia" }).length).toBe(3);
    const hits = run({ q: "japan" }, "en").map((r) => r.slug);
    for (const r of restaurants.filter((x) => x.city.slug === "tokyo")) expect(hits).toContain(r.slug); // also matches the "Japanese" cuisine, like the original
  });
  it("search matches cuisine", () => expect(run({ q: "giapponese" }).every((r) => r.cuisine.key === "Japanese")).toBe(true));
  it("city, cuisine and level are exact filters", () => {
    expect(run({ city: "rome" }).every((r) => r.city.slug === "rome")).toBe(true);
    expect(run({ cuisine: "Italian" }).every((r) => r.cuisine.key === "Italian")).toBe(true);
    expect(run({ level: "3" }).every((r) => r.level === 3)).toBe(true);
  });
  it("price filter is strictly below the limit", () => {
    const cheapest = Math.min(...restaurants.map((r) => r.price));
    expect(run({ max: String(cheapest) })).toHaveLength(0);
    expect(run({ max: String(cheapest + 1) }).length).toBeGreaterThan(0);
    expect(run({ max: "100" }).every((r) => r.price < 100)).toBe(true);
  });
  it("rooms filter", () => expect(run({ rooms: true }).every((r) => r.rooms)).toBe(true));
  it("combined filters intersect", () => {
    const r = run({ level: "1", max: "150", cuisine: "French" });
    expect(r.every((x) => x.level === 1 && x.price < 150 && x.cuisine.key === "French")).toBe(true);
  });
  it("sorts by price, price desc and name", () => {
    const p = run({ sort: "price" }).map((r) => r.price);
    expect(p).toEqual([...p].sort((a, b) => a - b));
    const h = run({ sort: "high" }).map((r) => r.price);
    expect(h).toEqual([...h].sort((a, b) => b - a));
    const n = run({ sort: "name" }).map((r) => r.name);
    expect(n).toEqual([...n].sort((a, b) => a.localeCompare(b, "it")));
  });
  it("no results is an empty list, not an error", () => expect(run({ q: "zzzzqq" })).toEqual([]));
});

describe("URL ↔ filters", () => {
  it("round-trips", () => {
    const f = parseFilters(new URLSearchParams("q=sale&city=paris&cuisine=French&level=2&max=200&rooms=1&sort=price"));
    expect(f).toEqual({ q: "sale", city: "paris", cuisine: "French", level: "2", max: "200", rooms: true, sort: "price" });
    expect(parseFilters(new URLSearchParams(serializeFilters(f)))).toEqual(f);
  });
  it("rejects invalid values and keeps the URL clean", () => {
    const f = parseFilters(new URLSearchParams("level=9&max=-5&sort=evil&q=" + "x".repeat(300)));
    expect(f.level).toBe("");
    expect(f.max).toBe("");
    expect(f.sort).toBe("");
    expect(f.q).toHaveLength(100);
    expect(serializeFilters(emptyFilters)).toBe("");
  });
  it("a forced city (from /restaurants/paris/) wins over the query", () => expect(parseFilters(new URLSearchParams("city=rome"), "paris").city).toBe("paris"));
});
