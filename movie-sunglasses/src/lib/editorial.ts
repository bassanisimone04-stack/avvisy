import type { Catalog } from "./catalog";
import { normalize, truncate } from "./format";
import type { Article } from "./types";

export function suggestMeta(a: Pick<Article, "title" | "targetKeyword" | "answer" | "excerpt" | "body">) {
  const titles = [...new Set([
    truncate(a.title, 60),
    a.targetKeyword ? truncate(`${a.targetKeyword.replace(/\b\w/g, (c) => c.toUpperCase())}: Models, Sources & Alternatives`, 60) : "",
    a.targetKeyword ? truncate(`${a.targetKeyword.replace(/\b\w/g, (c) => c.toUpperCase())} — What We Know`, 60) : "",
  ].filter(Boolean))];
  const base = (a.answer || a.excerpt || a.body.replace(/[#*\-\[\]()]/g, " ").replace(/\s+/g, " ")).trim();
  const firstSentence = base.split(/(?<=[.!?])\s/)[0] ?? base;
  const descriptions = [...new Set([truncate(firstSentence, 155), truncate(base, 155)])];
  return { titles, descriptions };
}

export interface LinkSuggestion { name: string; href: string; type: string }
export function linkTargets(c: Catalog): LinkSuggestion[] {
  return [
    ...c.models.map((m) => ({ name: m.name, href: `/sunglasses/${m.slug}`, type: "Modello" })),
    ...c.movies.map((m) => ({ name: m.title, href: `/movies/${m.slug}`, type: "Film" })),
    ...c.actors.map((m) => ({ name: m.name, href: `/actors/${m.slug}`, type: "Attore" })),
    ...c.brands.map((m) => ({ name: m.name, href: `/brands/${m.slug}`, type: "Marchio" })),
  ].sort((a, b) => b.name.length - a.name.length);
}

/** Body ranges that are NOT inside an existing markdown link. */
const unlinked = (body: string) => body.replace(/\[[^\]]*\]\([^)]*\)/g, (m) => " ".repeat(m.length));

export function suggestLinks(body: string, targets: LinkSuggestion[], selfPath?: string): LinkSuggestion[] {
  const free = unlinked(body).toLowerCase();
  const out: LinkSuggestion[] = [];
  for (const t of targets) {
    if (t.href === selfPath || t.name.length < 4) continue;
    if (free.includes(t.name.toLowerCase()) && !out.some((o) => o.href === t.href)) out.push(t);
  }
  return out;
}

export function applyLink(body: string, name: string, href: string): string {
  const free = unlinked(body);
  const i = free.toLowerCase().indexOf(name.toLowerCase());
  if (i < 0) return body;
  return body.slice(0, i) + `[${body.slice(i, i + name.length)}](${href})` + body.slice(i + name.length);
}

/** Models whose name (or brand + code) appears in the article, or that appear in the linked movies. */
export function suggestModels(c: Catalog, a: Pick<Article, "title" | "body" | "targetKeyword" | "modelIds" | "movieIds">) {
  const text = normalize(`${a.title} ${a.body} ${a.targetKeyword}`);
  const ids = new Set<string>();
  for (const m of c.models) {
    if (a.modelIds.includes(m.id)) continue;
    const n = normalize(m.name);
    if (n.length > 5 && text.includes(n)) ids.add(m.id);
  }
  for (const mv of a.movieIds) for (const m of c.modelsForMovie(mv)) if (!a.modelIds.includes(m.id)) ids.add(m.id);
  return [...ids].map((id) => c.modelById.get(id)!).filter(Boolean);
}

/** The "FACTS" block given to the AI and used to validate its output. Only evidence-backed, effective labels. */
export function buildFacts(c: Catalog, a: Pick<Article, "modelIds" | "movieIds" | "title">): string {
  const lines: string[] = [];
  const movieIds = new Set(a.movieIds);
  const modelIds = new Set(a.modelIds);
  for (const mv of a.movieIds) for (const m of c.modelsForMovie(mv)) modelIds.add(m.id);
  for (const id of modelIds) for (const ap of c.appsForModel(id)) if (a.movieIds.length === 0 || movieIds.has(ap.movieId) || a.modelIds.includes(id)) movieIds.add(ap.movieId);
  for (const mid of movieIds) { const mv = c.movieById.get(mid); if (mv) lines.push(`MOVIE: ${mv.title} (${mv.year}), page /movies/${mv.slug}`); }
  for (const id of modelIds) {
    const m = c.modelById.get(id); if (!m) continue;
    lines.push(`MODEL: ${m.name}${m.modelCode ? ` [${m.modelCode}]` : ""}, brand ${c.brandById.get(m.brandId)?.name}, shape ${m.shape}, frame ${m.frameColor}, lens ${m.lensColor}, status ${m.status}; page /sunglasses/${m.slug}; ${m.description}`);
    for (const sp of m.specs) lines.push(`  SPEC: ${sp.label}: ${sp.value}`);
    for (const ap of c.appsForModel(id)) {
      const em = c.matchOf(ap), mv = c.movieById.get(ap.movieId), ac = c.actorById.get(ap.actorId), ch = c.charById.get(ap.characterId);
      lines.push(`  APPEARANCE: ${ac?.name} as ${ch?.name} in ${mv?.title} (${mv?.year}) — label ${em.type}${em.downgraded ? ` (proposed ${em.declared}, downgraded: ${em.reason})` : ""}. ${ap.notes}`);
      for (const e of c.evByApp.get(ap.id) ?? []) lines.push(`    SOURCE (${e.stance}): ${e.sourceTitle} <${e.sourceUrl}> [${e.sourceType}] — ${e.supports}`);
    }
    for (const { model, alt } of c.alternativesOf(id)) lines.push(`  ALTERNATIVE: ${model.name} (/sunglasses/${model.slug}) — ${alt.reason}`);
  }
  return lines.join("\n");
}
