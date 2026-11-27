import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug, isSlug } from "@/lib/slug";

describe("slugify", () => {
  it.each([
    ["Maison Lune", "maison-lune"], ["Café Ñandú — Kraków", "cafe-nandu-krakow"], ["Saffron & Slate", "saffron-and-slate"],
    ["La Table d'Ombre", "la-table-dombre"], ["Skov og Hav (Øresund)", "skov-og-hav-oresund"], ["  --Weird__Input!!  ", "weird-input"], ["Straße", "strasse"],
  ])("%s → %s", (a, b) => expect(slugify(a)).toBe(b));
  it("limits length and never ends with a dash", () => {
    const s = slugify("a ".repeat(100));
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s.endsWith("-")).toBe(false);
  });
});
describe("uniqueSlug", () => {
  it("adds the qualifier, then a counter", () => {
    expect(uniqueSlug("Rug", [])).toBe("rug");
    expect(uniqueSlug("Rug", ["rug"], "Copenhagen")).toBe("rug-copenhagen");
    expect(uniqueSlug("Rug", ["rug", "rug-copenhagen"], "Copenhagen")).toBe("rug-2");
  });
  it("validates slugs", () => {
    expect(isSlug("maison-lune-paris")).toBe(true);
    expect(isSlug("Bad Slug")).toBe(false);
    expect(isSlug("../etc")).toBe(false);
  });
});
