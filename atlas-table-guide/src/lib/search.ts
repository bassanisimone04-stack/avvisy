/**
 * Lightweight search used when Typesense is not configured:
 * diacritic-insensitive tokens, prefix matching, trigram typo tolerance and bilingual synonyms.
 */
export function normalize(s: string): string {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

const STOP = new Set(["the", "a", "an", "in", "of", "and", "with", "il", "la", "lo", "di", "a", "e", "con", "le", "les", "de", "restaurant", "restaurants", "ristorante", "ristoranti"]);

/** Bilingual synonyms: query token → canonical tokens it should also match. */
export const SYNONYMS: Record<string, string[]> = {
  degustazione: ["tasting"],
  degustation: ["tasting"],
  omakase: ["sushi", "counter"],
  pesce: ["seafood", "fish"],
  fish: ["seafood"],
  mare: ["seafood", "sea"],
  vegano: ["vegan"],
  vegana: ["vegan"],
  vegetariano: ["vegetarian"],
  vegetariana: ["vegetarian"],
  giapponese: ["japanese"],
  francese: ["french"],
  italiana: ["italian"],
  italiano: ["italian"],
  parigi: ["paris"],
  londra: ["london"],
  milano: ["milan"],
  roma: ["rome"],
  barcellona: ["barcelona"],
  copenaghen: ["copenhagen"],
  nyc: ["new", "york"],
  romantico: ["romantic"],
  romantica: ["romantic"],
  terrazza: ["terrace"],
  vino: ["wine"],
  vini: ["wine"],
  nordica: ["nordic"],
  scandinavian: ["nordic"],
};

export function tokens(s: string): string[] {
  return normalize(s).split(" ").filter((t) => t && !STOP.has(t));
}

function trigrams(s: string): Set<string> {
  const p = `  ${s} `;
  const out = new Set<string>();
  for (let i = 0; i < p.length - 2; i++) out.add(p.slice(i, i + 3));
  return out;
}

/** Jaccard similarity of trigram sets (0..1). */
export function trigramSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const A = trigrams(a);
  const B = trigrams(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n]!;
}

function tokenScore(q: string, docTokens: string[]): number {
  let best = 0;
  for (const d of docTokens) {
    if (d === q) return 1;
    if (d.startsWith(q) && q.length >= 2) best = Math.max(best, 0.9);
    else if (q.length >= 4) {
      const lev = levenshtein(q, d.slice(0, Math.max(q.length, d.length)));
      const maxTypos = q.length >= 8 ? 2 : 1;
      if (lev <= maxTypos) best = Math.max(best, 0.8);
      else {
        const sim = trigramSimilarity(q, d);
        if (sim >= 0.45) best = Math.max(best, sim * 0.8);
      }
    }
  }
  return best;
}

/** Score 0..1: average best match of each query token (with synonym expansion). */
export function scoreText(query: string, text: string): number {
  const q = tokens(query);
  if (!q.length) return 1;
  const d = tokens(text);
  let total = 0;
  for (const t of q) {
    const alts = [t, ...(SYNONYMS[t] ?? [])];
    total += Math.max(...alts.map((a) => tokenScore(a, d)));
  }
  return total / q.length;
}

export type SearchDoc = { type: "restaurant" | "city" | "chef" | "cuisine" | "article" | "hotel" | "experience"; id: string; title: string; subtitle: string; href: string; text: string; boost?: number };

export function search(docs: SearchDoc[], query: string, limit = 8): (SearchDoc & { score: number })[] {
  if (!normalize(query)) return [];
  return docs
    .map((d) => {
      const titleScore = scoreText(query, d.title);
      const s = Math.max(titleScore * 1.1, scoreText(query, `${d.title} ${d.text}`)) + (d.boost ?? 0);
      return { ...d, score: s };
    })
    .filter((d) => d.score >= 0.6)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
