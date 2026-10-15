import { normalize, parseNumber, slugify } from "./format";
import type { Keyword } from "./types";

/** RFC-4180-ish CSV parser (quotes, escaped quotes, CRLF, ; or , or tab delimiter). */
export function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/, 1)[0] ?? "";
  const delim = [",", ";", "\t"].map((d) => [d, first.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0];
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); if (row.some((c) => c.trim())) rows.push(row); row = []; cur = ""; }
    else cur += ch;
  }
  row.push(cur); if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

const HEAD = {
  term: ["keyword", "keywords", "term", "query", "parola chiave", "keyword (by volume)"],
  volume: ["volume", "search volume", "avg. monthly searches", "avg monthly searches", "volume di ricerca"],
  difficulty: ["difficulty", "kd", "keyword difficulty", "kd %", "difficolta"],
  intent: ["intent", "search intent", "intento"],
};
const num = (s: string | undefined) => parseNumber(s);

export function keywordsFromCsv(text: string, source: string): { items: Keyword[]; skipped: number } {
  const rows = parseCsv(text);
  if (!rows.length) return { items: [], skipped: 0 };
  const head = rows[0].map((h) => normalize(h));
  const idx = (names: string[]) => head.findIndex((h) => names.map(normalize).includes(h));
  const hasHeader = idx(HEAD.term) >= 0;
  const ti = hasHeader ? idx(HEAD.term) : 0, vi = hasHeader ? idx(HEAD.volume) : 1, di = hasHeader ? idx(HEAD.difficulty) : -1, ii = hasHeader ? idx(HEAD.intent) : -1;
  const items = new Map<string, Keyword>();
  let skipped = 0;
  for (const r of rows.slice(hasHeader ? 1 : 0)) {
    const term = (r[ti] ?? "").trim().toLowerCase();
    if (!term || term.length > 120) { skipped++; continue; }
    const id = `kw-${slugify(term)}`.slice(0, 100);
    items.set(id, { id, term, volume: vi >= 0 ? num(r[vi]) : null, difficulty: di >= 0 ? num(r[di]) : null, intent: ii >= 0 ? (r[ii] ?? "").trim() : "", cluster: "", source });
  }
  return { items: [...items.values()], skipped };
}

const STOP = new Set(["the", "a", "an", "of", "in", "for", "to", "and", "what", "does", "do", "is", "are", "wear", "worn", "wears", "by", "on", "with", "best", "top", "where", "buy", "how", "from", "movie", "movies", "film", "sunglasses", "glasses"]);
const stem = (w: string) => w.replace(/'s$/, "").replace(/s$/, "");
const tokens = (t: string) => new Set(normalize(t).split(" ").filter((w) => w && !STOP.has(w)).map(stem).filter((w) => w && !STOP.has(w)));
const jaccard = (a: Set<string>, b: Set<string>) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };

/** Greedy token-overlap clustering. Cluster label = the highest-volume (or first) keyword. Deterministic. */
export function clusterKeywords(list: Keyword[], threshold = 0.34): Map<string, Keyword[]> {
  const sorted = [...list].sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1) || a.term.localeCompare(b.term));
  const clusters: { label: string; tok: Set<string>; items: Keyword[] }[] = [];
  for (const k of sorted) {
    const t = tokens(k.term);
    let best: (typeof clusters)[number] | null = null, bs = 0;
    for (const c of clusters) { const s = Math.max(jaccard(t, c.tok), t.size && [...t].every((w) => c.tok.has(w)) ? 0.5 : 0); if (s > bs) { bs = s; best = c; } }
    if (best && bs >= threshold) { best.items.push(k); t.forEach((w) => best!.tok.add(w)); }
    else clusters.push({ label: k.term, tok: new Set(t), items: [k] });
  }
  return new Map(clusters.map((c) => [c.label, c.items]));
}
