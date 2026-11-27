import { describe, expect, it } from "vitest";
import { facetIndexability, passesQualityGate } from "@/seo/indexable-facets";

const base = { hubPath: "/en/restaurants/france/paris/", kind: "city" as const, hubPassesQualityGate: true };
describe("facet indexation policy", () => {
  it("indexes a clean hub that passes the quality gate", () => expect(facetIndexability({ ...base, params: {} })).toMatchObject({ index: true, canonicalPath: base.hubPath }));
  it("noindexes a thin hub", () => expect(facetIndexability({ ...base, params: {}, hubPassesQualityGate: false }).index).toBe(false));
  it("ignores tracking parameters", () => expect(facetIndexability({ ...base, params: { utm_source: "x" } }).index).toBe(true));
  it("indexes whitelisted city+cuisine with enough results (self-canonical)", () => {
    expect(facetIndexability({ ...base, params: { cuisine: "french" }, facetVerifiedCount: 5 })).toEqual({ index: true, canonicalPath: `${base.hubPath}?cuisine=french`, reason: "whitelisted city+cuisine" });
  });
  it("noindexes city+cuisine below threshold, multi-cuisine, or on country hubs", () => {
    expect(facetIndexability({ ...base, params: { cuisine: "french" }, facetVerifiedCount: 1 }).index).toBe(false);
    expect(facetIndexability({ ...base, params: { cuisine: "french,seafood" }, facetVerifiedCount: 9 }).index).toBe(false);
    expect(facetIndexability({ ...base, kind: "country", params: { cuisine: "french" }, facetVerifiedCount: 9 }).index).toBe(false);
  });
  it.each([["sort", "price-asc"], ["page", "2"], ["view", "map"], ["rec", "3"], ["q", "lune"], ["near", "1,2"]])("noindex + canonical-to-parent for %s", (k, v) => {
    expect(facetIndexability({ ...base, params: { [k]: v } })).toMatchObject({ index: false, canonicalPath: base.hubPath });
  });
  it("quality gate requires verified count and intro", () => {
    expect(passesQualityGate(5, true)).toBe(true);
    expect(passesQualityGate(4, true)).toBe(false);
    expect(passesQualityGate(9, false)).toBe(false);
  });
});
