import { describe, expect, it } from "vitest";
import { effectiveMatch } from "../src/lib/evidence";
import { clusterKeywords, keywordsFromCsv, parseCsv } from "../src/lib/keywords";
import { checkClaims } from "../src/lib/claims";
import { applyLink, suggestLinks } from "../src/lib/editorial";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { buildCatalog } from "../src/lib/catalog";
import { seed } from "../src/data/seed";
import { searchCatalog } from "../src/lib/search";
import type { Evidence } from "../src/lib/types";

const ev = (over: Partial<Evidence>): Evidence => ({ id: "e", appearanceId: "a", sourceType: "retailer", sourceTitle: "t", sourceUrl: "https://a.com/x", checkedAt: "2026-01-01", supports: "s", stance: "supports", ...over });

describe("effectiveMatch", () => {
  it("downgrades exact with no evidence", () => expect(effectiveMatch({ matchType: "exact" }, []).type).toBe("unconfirmed"));
  it("downgrades exact with a single retailer", () => expect(effectiveMatch({ matchType: "exact" }, [ev({})]).type).toBe("unconfirmed"));
  it("keeps exact with one press source", () => expect(effectiveMatch({ matchType: "exact" }, [ev({ sourceType: "press" })]).type).toBe("exact"));
  it("keeps exact with two independent domains", () => expect(effectiveMatch({ matchType: "exact" }, [ev({}), ev({ sourceUrl: "https://www.b.com/y" })]).type).toBe("exact"));
  it("does not count two pages of one domain as independent", () => expect(effectiveMatch({ matchType: "exact" }, [ev({}), ev({ sourceUrl: "https://a.com/z" })]).type).toBe("unconfirmed"));
  it("downgrades when any source disputes", () => expect(effectiveMatch({ matchType: "official_reissue" }, [ev({ sourceType: "brand" }), ev({ stance: "disputes", sourceUrl: "https://c.com" })]).type).toBe("unconfirmed"));
  it("never upgrades unconfirmed", () => expect(effectiveMatch({ matchType: "unconfirmed" }, [ev({ sourceType: "press" })]).type).toBe("unconfirmed"));
  it("leaves similar untouched", () => expect(effectiveMatch({ matchType: "similar" }, []).type).toBe("similar"));
});

describe("seed integrity", () => {
  const c = buildCatalog(seed as never);
  it("has every foreign key resolved", () => {
    for (const a of seed.appearances) {
      expect(c.modelById.has(a.modelId), a.id).toBe(true); expect(c.movieById.has(a.movieId), a.id).toBe(true);
      expect(c.actorById.has(a.actorId), a.id).toBe(true); expect(c.charById.has(a.characterId), a.id).toBe(true);
    }
    for (const m of seed.models) expect(c.brandById.has(m.brandId), m.id).toBe(true);
    for (const e of seed.evidence) expect(c.appById.has(e.appearanceId), e.id).toBe(true);
    for (const x of seed.alternatives) { expect(c.modelById.has(x.originalModelId)).toBe(true); expect(c.modelById.has(x.alternativeModelId)).toBe(true); }
    for (const a of seed.articles) { a.modelIds.forEach((i) => expect(c.modelById.has(i), a.id + i).toBe(true)); a.movieIds.forEach((i) => expect(c.movieById.has(i), a.id + i).toBe(true)); }
  });
  it("invents no prices", () => expect(seed.offers.length).toBe(0));
  it("has 20 article briefs/articles", () => expect(seed.articles.length).toBe(20));
  it("never labels a single-source Bond identification as exact", () => expect(c.matchOf(c.appById.get("a-spec-snowdon")!).type).toBe("unconfirmed"));
  it("flags the disputed F1 identification", () => expect(c.matchOf(c.appById.get("a-f1-d002")!).type).toBe("unconfirmed"));
  it("finds models by film, actor and code", () => {
    expect(searchCatalog(c, "top gun").some((h) => h.href === "/movies/top-gun")).toBe(true);
    expect(searchCatalog(c, "tom cruise")[0].type).toBe("actor");
    expect(searchCatalog(c, "RB3025").some((h) => h.href.includes("rb3025"))).toBe(true);
    expect(searchCatalog(c, "leon").some((h) => h.href === "/movies/leon-the-professional")).toBe(true);
  });
});

describe("keywords", () => {
  it("parses quoted CSV with commas", () => expect(parseCsv('a,b\n"x, y",2\n')).toEqual([["a", "b"], ["x, y", "2"]]));
  it("maps Semrush-like headers and keeps missing volume null", () => {
    const { items } = keywordsFromCsv("Keyword,Volume,KD\ntop gun sunglasses,\"1,300\",45\nrisky business sunglasses,,\n", "t");
    expect(items[0].volume).toBe(1300); expect(items[0].difficulty).toBe(45); expect(items[1].volume).toBeNull();
  });
  it("clusters near-duplicates", () => {
    const k = ["top gun sunglasses", "top gun aviators", "risky business sunglasses", "tom cruise risky business sunglasses"].map((term, i) => ({ id: String(i), term, volume: null, difficulty: null, intent: "", cluster: "", source: "" }));
    const cl = [...clusterKeywords(k).values()].map((x) => x.map((y) => y.term));
    expect(cl.length).toBe(2);
  });
});

describe("claims check", () => {
  const facts = "Top Gun (1986) Ray-Ban Aviator RB3025";
  it("flags unknown years, prices, codes and superlatives", () => {
    const f = checkClaims("Released in 1987. It costs $199. The RB9999 is the only pair. Sales rose 40%.", facts).map((x) => x.kind);
    expect(f).toEqual(expect.arrayContaining(["year", "price", "model_code", "superlative", "percentage"]));
  });
  it("does not flag facts that are supplied", () => expect(checkClaims("Maverick wears the RB3025 in 1986.", facts)).toEqual([]));
  it("allows verified offer prices", () => expect(checkClaims("From $199.", facts, { allowedPrices: [199] })).toEqual([]));
});

describe("link suggestions", () => {
  const targets = [{ name: "Top Gun", href: "/movies/top-gun", type: "Film" }];
  it("suggests unlinked mentions only", () => {
    expect(suggestLinks("We love Top Gun.", targets).length).toBe(1);
    expect(suggestLinks("We love [Top Gun](/movies/top-gun).", targets).length).toBe(0);
  });
  it("applies a link once without touching existing links", () => expect(applyLink("[Top Gun](/x) and Top Gun", "Top Gun", "/movies/top-gun")).toBe("[Top Gun](/x) and [Top Gun](/movies/top-gun)"));
});

describe("session tokens", () => {
  process.env.SESSION_SECRET = "x".repeat(40);
  it("round-trips", async () => expect((await verifySessionToken(await createSessionToken("a@b.c")))?.sub).toBe("a@b.c"));
  it("rejects tampering", async () => { const t = await createSessionToken("a@b.c"); expect(await verifySessionToken(t.slice(0, -2) + "xx")).toBeNull(); });
  it("rejects garbage", async () => expect(await verifySessionToken("nope")).toBeNull());
});

import { fitTitle, modelSeo, movieSeo, actorSeo, brandSeo, styleSeo } from "../src/lib/seo-copy";
import { keywordCandidates } from "../src/lib/keyword-candidates";
import { auditSite } from "../src/lib/seo-audit";

describe("seo copy", () => {
  const c = buildCatalog(seed as never);
  it("keeps every generated title within 60 characters and description within 155", () => {
    const all = [
      ...c.models.map((m) => modelSeo(c, m)), ...c.movies.map((m) => movieSeo(c, m)),
      ...c.actors.filter((a) => c.modelsForActor(a.id).length).map((a) => actorSeo(c, a)), ...c.brands.map((b) => brandSeo(c, b)),
      ...["aviator", "wayfarer", "cat-eye", "rectangular", "oval", "vintage", "futuristic"].map(styleSeo),
    ];
    for (const s of all) { expect(s.title.length, s.title).toBeLessThanOrEqual(60); expect(s.description.length, s.description).toBeLessThanOrEqual(155); }
  });
  it("generates unique titles for all model pages", () => {
    const t = c.models.map((m) => modelSeo(c, m).title);
    expect(new Set(t).size).toBe(t.length);
  });
  it("never leaks '(reported)' codes into titles", () => expect(c.models.every((m) => !modelSeo(c, m).title.includes("reported"))).toBe(true));
  it("fitTitle trims on a word boundary", () => expect(fitTitle("A ".repeat(40)).length).toBeLessThanOrEqual(60));
  it("FAQ answers for unconfirmed identifications never state certainty", () => {
    const faq = modelSeo(c, c.modelById.get("st-dupont-d002-6051")!).faq;
    expect(faq[0].a).toMatch(/Unconfirmed/);
  });
  it("candidate keywords carry no volume and map to a page", () => {
    const k = keywordCandidates(c);
    expect(k.length).toBeGreaterThan(80);
    expect(k.every((x) => x.volume === null && !!x.targetUrl)).toBe(true);
    expect(new Set(k.map((x) => x.id)).size).toBe(k.length);
  });
  it("audit finds no over-long titles in generated pages", () => {
    const a = auditSite(c, []);
    expect(a.rows.filter((r) => r.kind !== "Articolo").every((r) => !r.issues.some((i) => i.startsWith("title di")))).toBe(true);
  });
});

import { compareRows, parseCompareIds } from "../src/lib/compare";
import { extractHeadings } from "../src/components/markdown";

describe("compare", () => {
  const c = buildCatalog(seed as never);
  it("keeps only known, unique ids and at most three", () => {
    const ids = parseCompareIds(c, "persol-649,nope,persol-649,ray-ban-original-wayfarer-rb2140,oakley-frogskins", "knockaround-premiums");
    expect(ids).toEqual(["persol-649", "ray-ban-original-wayfarer-rb2140", "oakley-frogskins"]);
  });
  it("accepts add= when there is room", () => expect(parseCompareIds(c, "persol-649", "oakley-frogskins")).toEqual(["persol-649", "oakley-frogskins"]));
  it("flags differing rows and shows no invented offers", () => {
    const rows = compareRows(c, ["persol-714-steve-mcqueen", "persol-649"].map((i) => c.modelById.get(i)!));
    expect(rows.find((r) => r.label === "Brand")!.differs).toBe(false);
    expect(rows.find((r) => r.label === "Evidence grade")!.differs).toBe(true);
    expect(rows.find((r) => r.label === "Lowest verified offer")!.values).toEqual(["None yet", "None yet"]);
  });
});

describe("article headings", () => {
  it("extracts h2 headings with stable ids", () => expect(extractHeadings("## What we know\n\ntext\n\n## [Link](/x) heading")).toEqual([{ id: "what-we-know", text: "What we know" }, { id: "link-heading", text: "Link heading" }]));
});
