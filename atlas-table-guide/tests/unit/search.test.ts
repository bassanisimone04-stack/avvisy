import { describe, expect, it } from "vitest";
import { scoreText, search, levenshtein, normalize, type SearchDoc } from "@/lib/search";

const docs: SearchDoc[] = [
  { type: "city", id: "paris", title: "Paris", subtitle: "France", href: "/p", text: "Paris Parigi France" },
  { type: "restaurant", id: "kawase", title: "Sushi Kawase", subtitle: "Tokyo", href: "/k", text: "sushi japanese tasting" },
  { type: "restaurant", id: "verdure", title: "Verdure", subtitle: "Paris", href: "/v", text: "vegetarian vegan plant tasting" },
];
describe("search", () => {
  it("is diacritic- and case-insensitive", () => expect(normalize("Café Ñandú")).toBe("cafe nandu"));
  it("tolerates typos (incl. transpositions)", () => {
    expect(levenshtein("parsi", "paris")).toBe(1);
    expect(search(docs, "parsi")[0]?.id).toBe("paris");
    expect(search(docs, "kawsae")[0]?.id).toBe("kawase");
  });
  it("supports prefixes", () => expect(search(docs, "verd")[0]?.id).toBe("verdure"));
  it("expands bilingual synonyms", () => {
    expect(scoreText("degustazione", "tasting menu")).toBeGreaterThanOrEqual(0.8);
    expect(search(docs, "vegano")[0]?.id).toBe("verdure");
    expect(search(docs, "parigi")[0]?.id).toBe("paris");
  });
  it("returns nothing for empty or unrelated queries", () => {
    expect(search(docs, "   ")).toEqual([]);
    expect(search(docs, "zzzzqqq")).toEqual([]);
  });
});
