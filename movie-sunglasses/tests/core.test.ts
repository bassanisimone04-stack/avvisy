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

import { offersFromCsv } from "../src/lib/offers-import";
describe("offers CSV import", () => {
  const models = seed.models as never[], merchants = seed.merchants as never[];
  const head = "model,merchant,price,availability,shipping,url,last_checked\n";
  it("accepts valid rows and resolves by id, slug or name", () => {
    const r = offersFromCsv(head + 'ray-ban-aviator-classic-rb3025,ebay,"$1,149.50",in stock,Free,https://www.ebay.com/itm/1,2026-10-01\nRay-Ban Predator 2,eBay,,,,https://www.ebay.com/itm/2,\n', models, merchants, "2026-10-15");
    expect(r.errors).toEqual([]);
    expect(r.offers.map((o) => [o.modelId, o.price, o.availability, o.lastChecked])).toEqual([["ray-ban-aviator-classic-rb3025", 1149.5, "in_stock", "2026-10-01"], ["ray-ban-predator-2-rb2027", null, "unknown", "2026-10-15"]]);
  });
  it("rejects http URLs, unknown models, non-USD and negative prices without guessing", () => {
    const r = offersFromCsv(head + "persol-649,ebay,10,in stock,,http://x.com/a,\nnope,ebay,10,in stock,,https://x.com,\npersol-649,ebay,-5,in stock,,https://x.com,\npersol-649,ebay,5,in stock,,https://x.com,2026-1-1\n", models, merchants);
    expect(r.errors.length).toBe(4);
    expect(r.offers.length).toBe(1 - 1);
  });
  it("requires the key columns", () => expect(offersFromCsv("price\n5\n", models, merchants).errors[0].message).toMatch(/obbligatoria/));
  it("reimport of the same model+merchant keeps one offer", () => expect(offersFromCsv(head + "persol-649,ebay,10,in stock,,https://x.com/1,\npersol-649,ebay,12,in stock,,https://x.com/2,\n", models, merchants).offers.length).toBe(1));
});

import { parseNumber } from "../src/lib/format";
describe("number parsing", () => {
  it.each([["1,300", 1300], ["1.300", 1300], ["1.149,50", 1149.5], ["$1,149.50", 1149.5], ["12,5", 12.5], ["12.5", 12.5], ["-5", -5], ["99", 99], ["1,234,567", 1234567]])("%s -> %d", (i, n) => expect(parseNumber(i)).toBe(n));
  it.each(["", "abc", "-"])("%s -> null", (i) => expect(parseNumber(i)).toBeNull());
  it("keeps EU thousands in keyword CSV", () => expect(keywordsFromCsv("Keyword;Volume\nfoo bar;1.300\n", "t").items[0].volume).toBe(1300));
});

import { clientIp, isBlocked, recordHit } from "../src/lib/ratelimit";
describe("rate limiting", () => {
  const h = (o: Record<string, string>) => new Headers(o);
  it("ignores a spoofed first X-Forwarded-For entry", () => expect(clientIp(h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))).toBe("203.0.113.9"));
  it("prefers platform headers", () => { expect(clientIp(h({ "x-vercel-forwarded-for": "198.51.100.4", "x-forwarded-for": "6.6.6.6" }))).toBe("198.51.100.4"); expect(clientIp(h({ "x-real-ip": "198.51.100.5" }))).toBe("198.51.100.5"); });
  it("blocks only after the limit of recorded failures", () => { for (let i = 0; i < 3; i++) { expect(isBlocked("t:1", 3, 1000)).toBe(false); recordHit("t:1"); } expect(isBlocked("t:1", 3, 1000)).toBe(true); });
});

import { STYLES } from "../src/lib/site";
describe("articles are consistent with the catalog", () => {
  const c = buildCatalog(seed as never);
  const slugs = {
    sunglasses: new Set(seed.models.map((m) => m.slug)), movies: new Set(seed.movies.map((m) => m.slug)), actors: new Set(seed.actors.map((m) => m.slug)),
    brands: new Set(seed.brands.map((m) => m.slug)), blog: new Set(seed.articles.map((m) => m.slug)), styles: new Set(STYLES.map((s) => s.slug)),
  } as Record<string, Set<string>>;
  const statics = new Set(["/sunglasses", "/movies", "/actors", "/brands", "/styles", "/vintage", "/affordable-alternatives", "/blog", "/about", "/contact", "/affiliate-disclosure"]);
  it("every internal link in every article body resolves", () => {
    for (const a of seed.articles) for (const m of a.body.matchAll(/\]\((\/[^)#]*)\)/g)) {
      const [, section, slug] = m[1].split("/");
      const ok = statics.has(m[1]) || (slugs[section]?.has(slug) ?? false);
      expect(ok, `${a.slug} -> ${m[1]}`).toBe(true);
    }
  });
  it("every source URL is https and every article has at least one source once developed", () => {
    for (const a of seed.articles.filter((x) => x.status !== "brief")) { expect(a.sources.length, a.slug).toBeGreaterThan(0); for (const s of a.sources) expect(s.url.startsWith("https://"), a.slug + s.url).toBe(true); }
  });
  it("all 20 planned articles are developed and none is marked reviewed (human review pending)", () => {
    expect(seed.articles.filter((a) => a.status === "brief").length).toBe(0);
    expect(seed.articles.every((a) => a.reviewed === false)).toBe(true);
  });
  it("grades quoted in the roundups match the computed grades", () => {
    const g = (id: string) => c.matchOf(c.appById.get(id)!).type;
    expect(g("a-rd-clubmaster")).toBe("exact");
    expect(g("a-tl-randolph")).toBe("unconfirmed");
    expect(g("a-mib-j")).toBe("exact"); expect(g("a-term-gargoyles")).toBe("exact"); expect(g("a-mv-wayfarer")).toBe("exact");
    expect(g("a-tca-714")).toBe("official_reissue"); expect(g("a-bat-manhattan")).toBe("official_reissue");
    expect(g("a-spec-snowdon")).toBe("unconfirmed"); expect(g("a-f1-d002")).toBe("unconfirmed"); expect(g("a-mx-neo")).toBe("unconfirmed");
    expect(g("a-leon-magnoli")).toBe("similar");
  });
});

describe("article text hygiene", () => {
  it("has no stray escapes or template leftovers", () => {
    for (const a of seed.articles) for (const t of [a.body, a.answer, a.metaDescription, a.metaTitle, a.excerpt, ...a.faq.map((f) => f.a)]) expect(/\\\$|\$\{|\bundefined\b|\[object/.test(t), a.slug).toBe(false);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Markdown } from "../src/components/markdown";
describe("markdown rendering", () => {
  it("renders links inside bold and leaves no raw markdown", () => {
    const html = renderToStaticMarkup(createElement(Markdown, { source: "- **[Premiums](/sunglasses/knockaround-premiums).** Text and [x](/movies/top-gun)" }));
    expect(html).toContain('<strong><a href="/sunglasses/knockaround-premiums">Premiums</a>.</strong>');
    expect(html).not.toMatch(/\]\(/);
  });
  it("renders no raw markdown for any article body", () => {
    for (const a of seed.articles) expect(/\]\(\/|\*\*/.test(renderToStaticMarkup(createElement(Markdown, { source: a.body }))), a.slug).toBe(false);
  });
  it("drops javascript: links", () => expect(renderToStaticMarkup(createElement(Markdown, { source: "[x](javascript:alert(1))" }))).not.toContain("href"));
});

import { validatePhoto } from "../src/lib/photos";
describe("photo rights", () => {
  const ok = { url: "https://cdn.example.com/a.jpg", alt: "Black Wayfarer frame on grey background", credit: "Studio X", license: "owned", approved: true, modelId: "persol-649", kind: "product" as const };
  it("accepts an owned, approved product photo", () => expect(validatePhoto(ok)).toBeNull());
  it("requires proof for anything not owned", () => {
    expect(validatePhoto({ ...ok, license: "press" })).toMatch(/prova/);
    expect(validatePhoto({ ...ok, license: "licensed", licenseUrl: "http://x.com" })).toMatch(/prova/);
    expect(validatePhoto({ ...ok, license: "cc", licenseUrl: "https://commons.wikimedia.org/wiki/File:X.jpg" })).toBeNull();
  });
  it("rejects unknown licenses, short alt text, missing credit and unlinked photos when approving", () => {
    expect(validatePhoto({ ...ok, license: "found-on-google" })).toMatch(/licenza/);
    expect(validatePhoto({ ...ok, alt: "frame" })).toMatch(/alternativo/);
    expect(validatePhoto({ ...ok, credit: " " })).toMatch(/credito/);
    expect(validatePhoto({ ...ok, modelId: undefined })).toMatch(/Collega|modello/);
  });
  it("lets drafts be saved without proof but never http", () => {
    expect(validatePhoto({ ...ok, approved: false, license: "press" })).toBeNull();
    expect(validatePhoto({ ...ok, url: "http://x.com/a.jpg" })).toMatch(/https/);
  });
  it("only approved photos reach the catalog indexes", () => {
    const d = { ...(seed as never as Record<string, unknown[]>), photos: [
      { id: "p1", url: "https://x.com/1.jpg", alt: "a long alt text", credit: "c", license: "owned", approved: true, kind: "product", modelId: "persol-649" },
      { id: "p2", url: "https://x.com/2.jpg", alt: "a long alt text", credit: "c", license: "owned", approved: false, kind: "product", modelId: "persol-649" },
      { id: "p3", url: "https://x.com/3.jpg", alt: "a long alt text", credit: "c", license: "owned", approved: true, kind: "scene", movieId: "top-gun", modelId: "persol-649" },
    ] };
    const c = buildCatalog(d as never);
    expect(c.approvedPhotos("persol-649").map((p) => p.id)).toEqual(["p1"]);
    expect(c.scenePhotosForModel("persol-649").map((p) => p.id)).toEqual(["p3"]);
    expect(c.photosForMovie("top-gun").map((p) => p.id)).toEqual(["p3"]);
  });
});

describe("fair use photos", () => {
  const f = { url: "https://cdn.example.com/s.jpg", alt: "Maverick on the flight deck at sunset", credit: "Paramount Pictures", license: "fair_use", approved: true, kind: "scene" as const, movieId: "top-gun", sourceUrl: "https://studio.example.com/press/still", rightsNote: "Reduced still shown beside our evidence analysis of the sunglasses; credited to the studio." };
  it("accepts a documented, hosted scene still", () => expect(validatePhoto(f, { ownHost: "cdn.example.com" })).toBeNull());
  it("requires a written rationale and a source page", () => {
    expect(validatePhoto({ ...f, rightsNote: "short" })).toMatch(/motivazione/);
    expect(validatePhoto({ ...f, sourceUrl: undefined })).toMatch(/origine/);
  });
  it("is limited to scene stills, never product shots", () => expect(validatePhoto({ ...f, kind: "product", modelId: "persol-649" })).toMatch(/solo per fotogrammi/));
  it("refuses hotlinks when an own storage host is configured", () => expect(validatePhoto({ ...f, url: "https://other-site.com/s.jpg" }, { ownHost: "cdn.example.com" })).toMatch(/hotlink/));
});
