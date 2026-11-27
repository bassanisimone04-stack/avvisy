import { describe, expect, it } from "vitest";
import { parseCsv, dryRunImport, nameSimilarity, classifyPair } from "@/lib/csv-import";

const header = "name,city,country,lat,lng,cuisine,website,lunch_price,dinner_price,wine_price,currency,source_url";
const existing = [{ id: "1", slug: "maison-lune-paris", name: "Maison Lune", lat: 48.8526, lng: 2.3462, website: "https://example.com/demo/maison-lune-paris" }];

describe("parseCsv", () => {
  it("handles quotes, escaped quotes, commas, CRLF and embedded newlines", () => {
    expect(parseCsv('a,"b, c","say ""hi"""\r\n1,"multi\nline",3\n\n')).toEqual([["a", "b, c", 'say "hi"'], ["1", "multi\nline", "3"]]);
  });
  it("strips a BOM", () => expect(parseCsv("﻿x,y")[0]).toEqual(["x", "y"]));
});

describe("dryRunImport", () => {
  it("reports missing required columns", () => {
    expect(dryRunImport("name,city\nA,B", existing).missingColumns).toEqual(["country", "lat", "lng", "source_url"]);
  });
  it("validates rows and normalises prices", () => {
    const csv = `${header}\nNew Place,Paris,France,48.86,2.34,french,https://new.example,"€ 1.250,00",,,EUR,https://new.example/menu\nBad,,France,999,2,,,,,,EUR,not-a-url`;
    const r = dryRunImport(csv, existing);
    expect(r.valid).toBe(1);
    expect(r.invalid[0]!.line).toBe(3);
    expect(r.invalid[0]!.errors.join()).toMatch(/city|lat|source_url/);
    expect(r.toInsert[0]).toMatchObject({ slug: "new-place-paris", lunch_price: 1250 });
  });
  it("detects duplicates against the database (fuzzy name + geo distance)", () => {
    const csv = `${header}\nMaison de la Lune,Paris,France,48.8527,2.3463,,,,,,EUR,https://x.example\nMaison Lune,Paris,France,48.86,2.35,,,,,,EUR,https://y.example`;
    const r = dryRunImport(csv, existing);
    expect(r.duplicates.map((d) => d.line)).toEqual([2, 3]);
    expect(r.toInsert).toHaveLength(0);
  });
  it("detects duplicates within the file and by website domain", () => {
    const csv = `${header}\nAlpha,Rome,Italy,41.9,12.5,,https://alpha.example,,,,EUR,https://alpha.example\nAlpha Ristorante,Rome,Italy,41.9001,12.5001,,,,,,EUR,https://x.example\nOther,Rome,Italy,45,9,,https://www.alpha.example/x,,,,EUR,https://x.example`;
    const r = dryRunImport(csv, []);
    expect(r.duplicates.map((d) => [d.line, d.matchSource])).toEqual([[3, "file"], [4, "file"]]);
    expect(r.toInsert.map((x) => x.name)).toEqual(["Alpha"]);
  });
  it("flags possible duplicates for review without skipping them", () => {
    const csv = `${header}\nMaison Lunette,Paris,France,48.855,2.35,,,,,,EUR,https://z.example`;
    const r = dryRunImport(csv, existing);
    expect(r.possibleDuplicates).toHaveLength(1);
    expect(r.toInsert).toHaveLength(1);
  });
});

describe("similarity", () => {
  it("ignores articles and accents", () => expect(nameSimilarity("Le Quai Bleu", "Quai Bleu")).toBe(1));
  it("far apart venues with the same name are not duplicates", () => expect(classifyPair({ name: "Rug", lat: 55.67, lng: 12.56 }, { name: "Rug", lat: 41.9, lng: 12.5 }).level).toBe("none"));
});
