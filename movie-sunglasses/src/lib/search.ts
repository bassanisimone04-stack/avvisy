import { normalize } from "./format";
import type { Catalog } from "./catalog";

export interface SearchHit { type: "movie" | "actor" | "character" | "brand" | "model" | "article"; label: string; sub: string; href: string; score: number }

function score(q: string, text: string): number {
  const t = normalize(text);
  if (!t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  const words = t.split(" ");
  const qWords = q.split(" ");
  if (qWords.every((w) => words.some((x) => x.startsWith(w)))) return 60;
  if (t.includes(q)) return 40;
  return 0;
}

export function searchCatalog(c: Catalog, raw: string, limit = 20): SearchHit[] {
  const q = normalize(raw);
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  const push = (h: Omit<SearchHit, "score">, s: number) => { if (s > 0) hits.push({ ...h, score: s }); };
  for (const m of c.models) {
    const brand = c.brandById.get(m.brandId)?.name ?? "";
    push({ type: "model", label: m.name, sub: `${brand}${m.modelCode ? " · " + m.modelCode : ""}`, href: `/sunglasses/${m.slug}` },
      Math.max(score(q, m.name), score(q, `${brand} ${m.name}`), score(q, m.modelCode ?? "") - 10));
  }
  for (const mv of c.movies) push({ type: "movie", label: mv.title, sub: `${mv.kind === "series" ? "TV series" : "Film"} · ${mv.year}`, href: `/movies/${mv.slug}` }, score(q, mv.title) + 5);
  for (const a of c.actors) push({ type: "actor", label: a.name, sub: "Actor", href: `/actors/${a.slug}` }, score(q, a.name) + 5);
  for (const ch of c.characters) {
    const a = c.actorById.get(ch.actorId), mv = c.movieById.get(ch.movieId);
    if (a && mv) push({ type: "character", label: ch.name, sub: `${a.name} in ${mv.title}`, href: `/actors/${a.slug}` }, score(q, ch.name));
  }
  for (const b of c.brands) push({ type: "brand", label: b.name, sub: "Brand", href: `/brands/${b.slug}` }, score(q, b.name));
  for (const ar of c.articles) push({ type: "article", label: ar.title, sub: "Guide", href: `/blog/${ar.slug}` }, score(q, ar.title) - 15);
  return hits.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label)).slice(0, limit);
}
