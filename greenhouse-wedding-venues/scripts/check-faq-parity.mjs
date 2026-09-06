/**
 * FAQ parity + keyword coverage check.
 *
 *   node scripts/check-faq-parity.mjs      (or: npm run check:faq)
 *
 * Google's structured-data policy requires that every Question/Answer marked up
 * as FAQPage is visible on the same page. This walks the built HTML and fails if
 * a question in the JSON-LD cannot be found in a visible <summary>, so an edit to
 * one half of the pair can never ship without the other.
 *
 * It also reports how many FAQ questions carry each target keyword — the map in
 * README §2 — so coverage stays visible as the site grows.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const KEYWORDS = [
  "greenhouse wedding venues",
  "glasshouse wedding venue",
  "botanical garden wedding venues",
  "greenhouse wedding venue in California",
  "greenhouse wedding venue in Texas",
  "greenhouse wedding venue in Florida",
  "greenhouse wedding venue in New York",
  "greenhouse wedding venue in North Carolina",
  "small greenhouse wedding venues",
  "greenhouse wedding cost",
  "greenhouse wedding venue in Italy",
  "conservatory wedding venues",
  "rain-proof outdoor wedding venues",
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
    .replace(/&mdash;/g, "—").replace(/&middot;/g, "·").replace(/&nbsp;/g, " ");

const strip = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

let failures = 0;
let totalFaqs = 0;
const allQuestions = [];

for (const file of walk(ROOT).sort()) {
  const html = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);

  let faqPage = null;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (err) {
      console.error(`✗ ${rel}: invalid JSON-LD — ${err.message}`);
      failures += 1;
      continue;
    }
    if (data["@type"] === "FAQPage") faqPage = data;
  }

  if (!faqPage) {
    console.log(`·  ${rel} — no FAQPage`);
    continue;
  }

  const visible = [...html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) => strip(m[1]));
  const missing = faqPage.mainEntity
    .map((q) => decode(q.name))
    .filter((name) => !visible.some((v) => v.includes(name)));

  totalFaqs += faqPage.mainEntity.length;
  allQuestions.push(...faqPage.mainEntity.map((q) => decode(q.name)));

  if (missing.length) {
    failures += missing.length;
    console.error(`✗  ${rel} — ${missing.length} marked-up question(s) not visible on the page:`);
    missing.forEach((q) => console.error(`     "${q}"`));
  } else {
    console.log(`✓  ${rel} — ${faqPage.mainEntity.length} FAQs, all visible`);
  }
}

console.log(`\n${totalFaqs} FAQs across the site\n`);
console.log("Keyword coverage in FAQ questions:");
for (const kw of KEYWORDS) {
  const n = allQuestions.filter((q) => q.toLowerCase().includes(kw.toLowerCase())).length;
  console.log(`  ${n ? "✓" : "✗"} ${kw.padEnd(44)} ${n}`);
  if (!n) failures += 1;
}

if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("\nAll FAQ markup mirrors visible content, and every target keyword is covered.");
