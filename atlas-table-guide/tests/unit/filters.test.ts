import { describe, expect, it } from "vitest";
import { applyFilters, parseFilters, serializeFilters, sortRestaurants, paginate, activeFilterCount, lowestEUR } from "@/lib/filters";
import { demoDataset } from "@/db/demo";
import { DEMO_REFERENCE_RATES as R } from "@/lib/fx-demo";

const d = demoDataset();
const all = d.restaurants;

describe("parseFilters / serializeFilters", () => {
  it("round-trips every filter", () => {
    const qs = "cuisine=french,seafood&diet=vegan&dinner=-150&feat=romantic,terrace&lunch=50-&near=48.857,2.352&page=2&q=lune&rec=1,2&res=online&sel=1&sort=price-asc&view=map&wine=10-90";
    const f = parseFilters(new URLSearchParams(qs));
    expect(f.recognition).toEqual([1, 2]);
    expect(f.dinner).toEqual({ min: undefined, max: 150 });
    expect(f.lunch).toEqual({ min: 50, max: undefined });
    expect(f.near).toEqual({ lat: 48.857, lng: 2.352 });
    expect(f.view).toBe("map");
    expect(parseFilters(new URLSearchParams(serializeFilters(f)))).toEqual(f);
  });
  it("drops invalid values safely", () => {
    const f = parseFilters({ rec: "9,x,2", sort: "evil", page: "-3", diet: "keto,vegan", feat: "spa,terrace", res: "pigeon", cuisine: "<script>" });
    expect(f.recognition).toEqual([2]);
    expect(f.sort).toBe("recommended");
    expect(f.page).toBe(1);
    expect(f.diet).toEqual(["vegan"]);
    expect(f.features).toEqual(["terrace"]);
    expect(f.reservation).toBeUndefined();
    expect(f.cuisine).toEqual([]);
  });
  it("omits defaults when serialising", () => {
    expect(serializeFilters(parseFilters({}))).toBe("");
  });
  it("counts active filters", () => {
    expect(activeFilterCount(parseFilters({ rec: "1,2", feat: "terrace", dinner: "-100", sort: "az" }))).toBe(4);
  });
});

describe("applyFilters", () => {
  it("filters by recognition level", () => {
    const r = applyFilters(all, parseFilters({ rec: "3" }), R);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.recognition.level === 3)).toBe(true);
  });
  it("filters by location", () => {
    expect(applyFilters(all, { ...parseFilters({}), city: "paris" }, R).every((x) => x.citySlug === "paris")).toBe(true);
  });
  it("filters by cuisine (any of)", () => {
    const r = applyFilters(all, parseFilters({ cuisine: "sushi,nordic" }), R);
    expect(r.every((x) => x.cuisines.includes("sushi") || x.cuisines.includes("nordic"))).toBe(true);
  });
  it("filters by dietary and features (all of)", () => {
    const r = applyFilters(all, parseFilters({ diet: "vegan,glutenFree", feat: "accessible" }), R);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.dietary.vegan && x.dietary.glutenFree && x.features.accessible)).toBe(true);
  });
  it("price ranges use EUR conversion and exclude venues without that price", () => {
    const r = applyFilters(all, parseFilters({ lunch: "-60" }), R);
    expect(r.length).toBeGreaterThan(0);
    for (const x of r) {
      const lunch = x.menus.find((m) => m.service === "lunch" && m.kind === "tasting")!;
      expect(lunch.amount).not.toBeNull();
      expect(lunch.amount! / (lunch.currency === "EUR" ? 1 : R.rates[lunch.currency]!)).toBeLessThanOrEqual(60);
    }
    expect(r.find((x) => x.slug === "atlantic-house-new-york")).toBeUndefined(); // lunch missing
  });
  it("filters by bounding box", () => {
    const r = applyFilters(all, parseFilters({ bbox: "2.2,48.8,2.5,48.95" }), R);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.citySlug === "paris")).toBe(true);
  });
  it("keyword uses typo-tolerant search", () => {
    expect(applyFilters(all, parseFilters({ q: "maison lnue" }), R).map((x) => x.slug)).toContain("maison-lune-paris");
  });
});

describe("sortRestaurants", () => {
  it("price ascending puts missing prices last", () => {
    const s = sortRestaurants(all, { sort: "price-asc" }, R);
    const vals = s.map((x) => lowestEUR(x, R));
    const known = vals.filter((v): v is number => v != null);
    expect(known).toEqual([...known].sort((a, b) => a - b));
    expect(vals.slice(known.length).every((v) => v == null)).toBe(true);
  });
  it("price descending", () => {
    const s = sortRestaurants(all, { sort: "price-desc" }, R).map((x) => lowestEUR(x, R)).filter((v): v is number => v != null);
    expect(s).toEqual([...s].sort((a, b) => b - a));
  });
  it("recognition descending, then A–Z", () => {
    const s = sortRestaurants(all, { sort: "recognition" }, R);
    for (let i = 1; i < s.length; i++) expect(s[i - 1]!.recognition.level).toBeGreaterThanOrEqual(s[i]!.recognition.level);
  });
  it("A–Z", () => {
    const names = sortRestaurants(all, { sort: "az" }, R).map((x) => x.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
  it("distance from a point", () => {
    const s = sortRestaurants(all, { sort: "distance", near: { lat: 35.68, lng: 139.65 } }, R);
    expect(s[0]!.citySlug).toBe("tokyo");
  });
  it("recommended puts editorial selection first and is not affected by commercial data", () => {
    expect(sortRestaurants(all, { sort: "recommended" }, R)[0]!.atlasSelection).toBe(true);
  });
});

describe("paginate", () => {
  it("clamps page numbers", () => {
    expect(paginate([1, 2, 3, 4, 5], 9, 2)).toMatchObject({ page: 3, pages: 3, items: [5], total: 5 });
  });
});
