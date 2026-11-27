/**
 * Extracts the JSON-LD of key pages into docs/jsonld-samples/*.json so it can be pasted into
 * https://validator.schema.org and Google's Rich Results Test (those services are not reachable from CI).
 * Usage: npm run build && npm run jsonld:dump
 */
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { parse } from "node-html-parser";

const PORT = 3198;
const BASE = process.env.SEO_BASE_URL ?? `http://localhost:${PORT}`;
const PAGES: [string, string][] = [["home", "/en/"], ["hub-city", "/en/restaurants/italy/rome/"], ["restaurant", "/en/restaurant/maison-lune-paris/"], ["hotel", "/en/hotel/palazzo-celeste-rome/"], ["article", "/en/magazine/how-to-read-a-tasting-menu-price/"], ["experience", "/en/experience/fresh-pasta-masterclass/"], ["itinerary", "/en/travel/gastronomic-journey-tuscany/"]];
let server: ChildProcess | undefined;
if (!process.env.SEO_BASE_URL) server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`${BASE}/robots.txt`)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 500)); }
  mkdirSync("docs/jsonld-samples", { recursive: true });
  for (const [name, path] of PAGES) {
    const html = await (await fetch(`${BASE}${path}`)).text();
    const blocks = parse(html).querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text));
    writeFileSync(`docs/jsonld-samples/${name}.json`, JSON.stringify(blocks.flat(), null, 2));
    console.log(`✓ ${name}: ${blocks.flat().length} node(s)`);
  }
} finally { if (server?.pid) { try { process.kill(-server.pid, "SIGTERM"); } catch { /* gone */ } } }
