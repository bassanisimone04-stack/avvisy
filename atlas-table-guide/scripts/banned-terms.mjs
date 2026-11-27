/**
 * Fails if third-party guide marks/names appear in source, assets or docs.
 * Terms are stored base64-encoded so this file does not itself contain them.
 * Factual award text is allowed ONLY as data in the restaurant_awards table (never in the repo).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const TERMS = ["bWljaGVsaW4=", "YmliIGdvdXJtYW5k", "Z3VpZGUgcm91Z2U=", "Z3JlZW4gc3Rhcg==", "Ymliw6luZHVt", "Z2F1bHQ\=", "bWljaGVsaW4tc3RhcnJlZA=="].map((b) => Buffer.from(b, "base64").toString("utf8").toLowerCase());
const ROOTS = ["src", "public", "docs", "supabase", "scripts", "tests", "README.md"];
const EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".sql", ".json", ".svg", ".txt", ".html", ""]);
const SKIP = new Set(["node_modules", ".next", "image-manifest.json", "banned-terms.mjs"]);
const hits = [];
function walk(p) {
  const base = p.split("/").pop();
  if (SKIP.has(base)) return;
  let st; try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!EXT.has(extname(p))) return;
  const text = readFileSync(p, "utf8").toLowerCase();
  for (const t of TERMS) { const i = text.indexOf(t); if (i >= 0) hits.push(`${p}: "${t}" at ${i}`); }
}
ROOTS.forEach((r) => walk(r));
if (hits.length) { console.error(`✗ banned terms found:\n${hits.join("\n")}`); process.exit(1); }
console.log("✓ no banned third-party terms");
