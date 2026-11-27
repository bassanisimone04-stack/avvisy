/**
 * SEO/a11y crawler for the BUILT site. Fails (exit 1) on any violation.
 * Usage: npm run build && npm run seo:check   (starts `next start` on SEO_PORT unless SEO_BASE_URL is set)
 */
import { spawn, type ChildProcess } from "node:child_process";
import { parse } from "node-html-parser";
import { validateJsonLd } from "../src/seo/jsonld";

const PORT = Number(process.env.SEO_PORT ?? 3199);
const BASE = process.env.SEO_BASE_URL ?? `http://localhost:${PORT}`;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example-guide.com").replace(/\/$/, "");
const errors: string[] = [];
const warn: string[] = [];
const fail = (url: string, msg: string) => errors.push(`${url}: ${msg}`);

async function waitUp() {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`${BASE}/robots.txt`)).ok) return; } catch { /* retry */ } await new Promise((r) => setTimeout(r, 500)); }
  throw new Error("server did not start");
}
const toLocal = (u: string) => u.replace(SITE, BASE);
const toPath = (u: string) => u.replace(SITE, "").replace(BASE, "");

type PageInfo = { url: string; status: number; title: string; robots: string; canonical: string; index: boolean };
const pages = new Map<string, PageInfo>();
const links = new Set<string>();

function walkTypes(n: unknown, acc: Set<string>) {
  if (Array.isArray(n)) n.forEach((x) => walkTypes(x, acc));
  else if (n && typeof n === "object") { const t = (n as Record<string, unknown>)["@type"]; if (typeof t === "string") acc.add(t); Object.values(n).forEach((v) => walkTypes(v, acc)); }
}

async function checkPage(path: string, expect: { indexable?: boolean } = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const html = await res.text();
  if (res.status !== 200) { fail(path, `status ${res.status}`); return; }
  const doc = parse(html);
  const h1 = doc.querySelectorAll("h1").length;
  if (h1 !== 1) fail(path, `has ${h1} <h1> (must be exactly 1)`);
  for (const img of doc.querySelectorAll("img")) if (img.getAttribute("alt") === undefined) fail(path, `<img src="${img.getAttribute("src")?.slice(0, 60)}"> without alt`);
  const title = doc.querySelector("title")?.text.trim() ?? "";
  if (!title) fail(path, "missing <title>");
  if (!doc.querySelector('meta[name="description"]')?.getAttribute("content")) fail(path, "missing meta description");
  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "index, follow";
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  if (!canonical) fail(path, "missing canonical");
  const index = !/noindex/.test(robots);
  const hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => l.getAttribute("hreflang"));
  if (index && !(hreflangs.includes("en") && hreflangs.includes("it") && hreflangs.includes("x-default"))) fail(path, `hreflang set incomplete: ${hreflangs.join(",")}`);
  const types = new Set<string>();
  for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.text);
      walkTypes(data, types);
      const errs = validateJsonLd(data);
      errs.forEach((e) => fail(path, `JSON-LD ${e}`));
    } catch (e) { fail(path, `invalid JSON-LD: ${(e as Error).message}`); }
  }
  const isHub = /^\/(en|it)\/restaurants\//.test(path) || /\/collections\/[^/]+\/$/.test(path);
  if (isHub && !(types.has("ItemList") && types.has("BreadcrumbList"))) fail(path, "hub without ItemList + BreadcrumbList");
  const inner = path.split("/").filter(Boolean).length > 1;
  if (inner && index && !types.has("BreadcrumbList")) fail(path, "inner page without BreadcrumbList");
  if (/\/restaurant\/[^/]+\/$/.test(path)) {
    if (!types.has("Restaurant")) fail(path, "profile without Restaurant JSON-LD");
    if (!doc.querySelector("[data-answer-first]")) fail(path, "profile without answer-first block");
  }
  if (expect.indexable === true && !index) fail(path, "listed in sitemap but noindex");
  if (expect.indexable === true && toPath(canonical) !== path) fail(path, `sitemap URL not self-canonical (canonical=${toPath(canonical)})`);
  for (const a of doc.querySelectorAll("a[href]")) { const h = a.getAttribute("href")!; if (h.startsWith("/") && !h.startsWith("//")) links.add(h.split("#")[0]!); }
  pages.set(path, { url: path, status: res.status, title, robots, canonical, index });
}

async function main() {
  let server: ChildProcess | undefined;
  if (!process.env.SEO_BASE_URL) {
    server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", env: process.env, detached: true });
  }
  try {
    await waitUp();
    // robots + llms
    const robots = await (await fetch(`${BASE}/robots.txt`)).text();
    for (const must of ["Disallow: /admin/", "Disallow: /api/", "Disallow: /go/", "Sitemap:"]) if (!robots.includes(must)) fail("/robots.txt", `missing "${must}"`);
    if (!(await fetch(`${BASE}/llms.txt`)).ok) fail("/llms.txt", "missing");
    // sitemaps
    const index = await (await fetch(`${BASE}/sitemap.xml`)).text();
    const segs = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toLocal(m[1]!));
    const urls = new Set<string>();
    for (const s of segs) {
      const xml = await (await fetch(s)).text();
      for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>/g)) urls.add(toPath(m[1]!.replace(/&amp;/g, "&")));
      if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(xml)) fail(s, "missing lastmod");
    }
    console.log(`sitemaps: ${segs.length} segments, ${urls.size} URLs`);
    for (const u of urls) await checkPage(u, { indexable: true });
    // non-indexable variants
    const facetCases: [string, boolean, string][] = [
      ["/en/restaurants/?rec=3", false, "/en/restaurants/"], ["/en/restaurants/france/paris/?sort=price-asc", false, "/en/restaurants/france/paris/"],
      ["/en/restaurants/?page=2", false, "/en/restaurants/"], ["/en/restaurants/?view=map", false, "/en/restaurants/"], ["/en/restaurants/italy/?feat=terrace&diet=vegan", false, "/en/restaurants/italy/"],
    ];
    for (const [u, shouldIndex, canon] of facetCases) {
      await checkPage(u);
      const p = pages.get(u);
      if (!p) continue;
      if (p.index !== shouldIndex) fail(u, `expected ${shouldIndex ? "index" : "noindex"}, got robots="${p.robots}"`);
      if (toPath(p.canonical) !== canon) fail(u, `canonical ${toPath(p.canonical)} ≠ ${canon}`);
      if (urls.has(u)) fail(u, "parameterised URL present in sitemap");
    }
    for (const u of ["/en/compare/?r=maison-lune-paris,rug-copenhagen", "/en/design-system/", "/en/account/"]) { await checkPage(u); if (pages.get(u)?.index) fail(u, "must be noindex"); }
    // unique titles among indexable pages (per locale; cross-locale pairs are linked by hreflang)
    const seen = new Map<string, string>();
    for (const p of pages.values()) if (p.index) { const key = `${p.url.split("/")[1]}|${p.title}`; if (seen.has(key)) fail(p.url, `duplicate <title> with ${seen.get(key)}`); else seen.set(key, p.url); }
    // internal links resolve (no dead links)
    const toCheck = [...links].filter((l) => !pages.has(l) && !l.startsWith("/_next") && !l.startsWith("/api/") && !l.startsWith("/go/"));
    for (const l of toCheck) { const r = await fetch(`${BASE}${l}`, { redirect: "manual" }); if (r.status >= 400) fail(l, `dead internal link (${r.status})`); }
    // custom 404
    const nf = await fetch(`${BASE}/en/this-page-does-not-exist/`);
    if (nf.status !== 404) fail("/en/this-page-does-not-exist/", `expected 404, got ${nf.status}`);
    console.log(`checked ${pages.size} pages, ${toCheck.length} extra internal links`);
  } finally {
    if (server?.pid) { try { process.kill(-server.pid, "SIGTERM"); } catch { /* already gone */ } }
  }
  warn.forEach((w) => console.warn("warn:", w));
  if (errors.length) { console.error(`\n✗ ${errors.length} SEO violation(s):\n${errors.slice(0, 200).join("\n")}`); process.exit(1); }
  console.log("✓ seo:check passed");
}
main().catch((e) => { console.error(e); process.exit(1); });
