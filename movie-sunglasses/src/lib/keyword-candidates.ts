import type { Catalog } from "./catalog";
import { slugify } from "./format";
import type { Keyword } from "./types";

const short = (n: string) => n.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
export const SOURCE = "generated candidate (volume NOT verified)";

export function intentOf(term: string): string {
  if (/\b(buy|price|cheap|affordable|under \$?\d+|alternative|similar|for sale|where)\b/.test(term)) return "commercial/transactional";
  if (/\b(what|which|who|wear|worn|model|brand)\b/.test(term)) return "informational (identify)";
  return "informational/commercial";
}

/**
 * Candidate long-tail keywords derived from the catalog, each mapped to the ONE page that should target it.
 * They carry NO volume: validate them in Semrush/Ahrefs/Keyword Planner before investing in content.
 */
export function keywordCandidates(c: Catalog): Keyword[] {
  const out = new Map<string, Keyword>();
  const add = (term: string, targetUrl: string) => {
    term = term.toLowerCase().replace(/\s+/g, " ").trim();
    const id = `kw-${slugify(term)}`.slice(0, 100);
    if (term.length > 3 && !out.has(id)) out.set(id, { id, term, volume: null, difficulty: null, intent: intentOf(term), cluster: "", source: SOURCE, targetUrl });
  };
  for (const mv of c.movies) {
    const u = `/movies/${mv.slug}`;
    add(`${mv.title} sunglasses`, u);
    add(`what sunglasses are worn in ${mv.title}`, u);
    add(`${mv.title} sunglasses brand`, u);
    for (const ap of c.appearances.filter((a) => a.movieId === mv.id)) {
      const ac = c.actorById.get(ap.actorId)!, ch = c.charById.get(ap.characterId)!;
      add(`what sunglasses does ${ac.name} wear in ${mv.title}`, `/sunglasses/${ap.modelId}`);
      add(`${ch.name} sunglasses ${mv.title}`, `/sunglasses/${ap.modelId}`);
    }
  }
  for (const a of c.actors) if (c.modelsForActor(a.id).length) { add(`${a.name} sunglasses`, `/actors/${a.slug}`); add(`${a.name} movie sunglasses`, `/actors/${a.slug}`); }
  for (const m of c.models) {
    const u = `/sunglasses/${m.slug}`, n = short(m.name);
    if (!c.isAlternativeOnly(m.id)) {
      add(`${n} sunglasses`, u);
      if (m.modelCode && /^[A-Z0-9 -]{3,12}$/.test(m.modelCode)) add(`${n} ${m.modelCode}`.toLowerCase(), u);
      add(`where to buy ${n}`, u);
      add(`${n} alternative`, u);
      if (m.status === "vintage") add(`vintage ${n}`, u);
    } else {
      add(`${n} sunglasses`, u);
    }
  }
  for (const s of ["aviator", "wayfarer", "cat-eye", "oval"]) {
    add(`${s.replace("-", " ")} sunglasses worn in movies`, `/styles/${s}`);
    add(`best ${s.replace("-", " ")} sunglasses inspired by movies`, `/styles/${s}`);
  }
  for (const a of c.articles) if (a.targetKeyword) add(a.targetKeyword, `/blog/${a.slug}`);
  return [...out.values()];
}
