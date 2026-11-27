import { describe, expect, it } from "vitest";
import { parsePrice, convert, combinedEstimate, priceBand, formatMoney, priceFrom } from "@/lib/price";
import { DEMO_REFERENCE_RATES as R } from "@/lib/fx-demo";
import { demoDataset } from "@/db/demo";

describe("parsePrice (normalisation)", () => {
  it.each([
    ["€ 1.250,00", 1250, "EUR"], ["1,250.50 EUR", 1250.5, "EUR"], ["¥48,000", 48000, "JPY"], ["£95", 95, "GBP"],
    ["120", 120, "EUR"], ["CHF 1'200.50", 1200.5, "CHF"], ["95,5 €", 95.5, "EUR"], ["$1,295", 1295, "USD"], ["1.250 DKK", 1250, "DKK"],
  ])("%s → %d %s", (input, amount, currency) => {
    expect(parsePrice(input)).toEqual({ amount, currency });
  });
  it("rejects non-prices", () => {
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("free")).toBeNull();
    expect(parsePrice(-5)).toBeNull();
  });
  it("rounds JPY to whole units", () => {
    expect(parsePrice("12345.67 JPY")).toEqual({ amount: 12346, currency: "JPY" });
  });
});

describe("convert", () => {
  it("is identity for same currency", () => expect(convert(100, "EUR", "EUR", null)).toBe(100));
  it("converts through EUR", () => {
    expect(convert(110, "USD", "EUR", R)).toBe(100);
    expect(convert(100, "EUR", "JPY", R)).toBe(16500);
    expect(convert(85, "GBP", "USD", R)).toBe(110);
  });
  it("returns null when rates are missing", () => {
    expect(convert(1, "EUR", "USD", { base: "EUR", date: "", source: "none", rates: {} })).toBeNull();
    expect(convert(1, "XXX", "EUR", R)).toBeNull();
  });
});

describe("restaurant price helpers", () => {
  const r = demoDataset().restaurants.find((x) => x.slug === "maison-lune-paris")!;
  it("priceFrom is the lowest usable tasting menu", () => expect(priceFrom(r)).toMatchObject({ amount: 145, currency: "EUR" }));
  it("combinedEstimate = dinner + wine", () => expect(combinedEstimate(r)).toEqual({ amount: 510, currency: "EUR" }));
  it("priceBand thresholds", () => {
    expect([priceBand(null), priceBand(50), priceBand(120), priceBand(200), priceBand(400)]).toEqual([0, 1, 2, 3, 4]);
  });
  it("formats money per locale", () => {
    expect(formatMoney(1250, "EUR", "en")).toBe("€1,250");
    expect(formatMoney(12500, "EUR", "it")).toMatch(/12\.500\s?€/); // it-IT does not group 4-digit numbers (CLDR)
  });
});
