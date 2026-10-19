import type { Catalog } from "./catalog";
import { normalize } from "./format";
import { actorSeo, brandSeo, modelSeo, movieSeo } from "./seo-copy";
import type { Article, Keyword } from "./types";

export interface AuditRow { url: string; kind: string; title: string; description: string; issues: string[] }

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function auditArticle(a: Article, c: Catalog): string[] {
  const issues: string[] = [];
  const live = a.status === "published" || a.status === "scheduled";
  const t = a.metaTitle || a.title, d = a.metaDescription;
  if (!a.metaTitle) issues.push("manca il meta title");
  if (!d) issues.push("manca la meta description");
  if (!live && a.status === "brief") return issues.length ? ["brief: da sviluppare"] : [];
  const kw = normalize(a.targetKeyword);
  if (kw) {
    const inT = normalize(t).includes(kw) || kw.split(" ").every((w) => normalize(t).includes(w));
    if (!inT) issues.push("la keyword principale non è nel title");
    if (d && !kw.split(" ").every((w) => normalize(d).includes(w))) issues.push("la keyword non è nella meta description");
    if (a.answer && !kw.split(" ").some((w) => w.length > 3 && normalize(a.answer).includes(w))) issues.push("la risposta immediata non richiama la keyword");
  } else issues.push("manca la keyword principale");
  if (t.length > 60) issues.push(`title di ${t.length} caratteri (max 60)`);
  if (d && d.length > 155) issues.push(`description di ${d.length} caratteri (max 155)`);
  if (d && d.length < 70) issues.push(`description corta (${d.length})`);
  if (words(a.body) < 300) issues.push(`contenuto breve (${words(a.body)} parole)`);
  if ((a.body.match(/\]\(\//g) ?? []).length < 2) issues.push("meno di 2 link interni nel testo");
  if (a.faq.length === 0) issues.push("nessuna FAQ");
  if (a.sources.length === 0) issues.push("nessuna fonte");
  if (a.modelIds.length === 0) issues.push("nessun modello collegato (niente schede prodotto)");
  void c;
  return issues;
}

export function auditSite(c: Catalog, keywords: Keyword[]) {
  const rows: AuditRow[] = [];
  const push = (url: string, kind: string, title: string, description: string, extra: string[] = []) => {
    const issues = [...extra];
    if (title.length > 60) issues.push(`title di ${title.length} caratteri (max 60)`);
    if (title.length < 25) issues.push("title troppo corto");
    if (description.length > 155) issues.push(`description di ${description.length} caratteri (max 155)`);
    if (description.length < 70) issues.push(`description corta (${description.length})`);
    rows.push({ url, kind, title, description, issues });
  };
  for (const m of c.models) {
    const s = modelSeo(c, m);
    const extra: string[] = [];
    if (m.description.length < 80) extra.push("descrizione modello molto breve (contenuto sottile)");
    if (!c.isAlternativeOnly(m.id) && c.appsForModel(m.id).every((a) => (c.evByApp.get(a.id)?.length ?? 0) === 0)) extra.push("nessuna fonte registrata");
    if (!m.reviewed) extra.push("non revisionato");
    push(`/sunglasses/${m.slug}`, "Modello", s.title, s.description, extra);
  }
  for (const mv of c.movies) { const s = movieSeo(c, mv); push(`/movies/${mv.slug}`, "Film", s.title, s.description, c.modelsForMovie(mv.id).length ? [] : ["nessun modello: pagina sottile (valuta noindex)"]); }
  for (const a of c.actors.filter((x) => c.modelsForActor(x.id).length)) { const s = actorSeo(c, a); push(`/actors/${a.slug}`, "Attore", s.title, s.description); }
  for (const b of c.brands.filter((x) => c.modelsForBrand(x.id).length)) { const s = brandSeo(c, b); push(`/brands/${b.slug}`, "Marchio", s.title, s.description); }
  for (const a of c.articles) push(`/blog/${a.slug}`, "Articolo", a.metaTitle || a.title, a.metaDescription, auditArticle(a, c));

  // duplicates (title / description)
  for (const key of ["title", "description"] as const) {
    const seen = new Map<string, AuditRow[]>();
    for (const r of rows) if (r[key]) seen.set(r[key], [...(seen.get(r[key]) ?? []), r]);
    for (const list of seen.values()) if (list.length > 1) for (const r of list) r.issues.push(`${key} duplicato con ${list.length - 1} altra/e pagina/e`);
  }
  // keyword cannibalisation: same target keyword on several articles, or one keyword mapped to several URLs
  const cannibal: string[] = [];
  const byKw = new Map<string, string[]>();
  for (const a of [...c.articles]) if (a.targetKeyword) byKw.set(normalize(a.targetKeyword), [...(byKw.get(normalize(a.targetKeyword)) ?? []), `/blog/${a.slug}`]);
  for (const [k, urls] of byKw) if (urls.length > 1) cannibal.push(`«${k}» è target di ${urls.length} articoli: ${urls.join(", ")}`);
  const byTerm = new Map<string, Set<string>>();
  for (const k of keywords) if (k.targetUrl) byTerm.set(normalize(k.term), (byTerm.get(normalize(k.term)) ?? new Set()).add(k.targetUrl));
  for (const [k, urls] of byTerm) if (urls.size > 1) cannibal.push(`«${k}» è mappata su ${urls.size} URL: ${[...urls].join(", ")}`);
  const unmapped = keywords.filter((k) => !k.targetUrl).length;
  return { rows, cannibal, unmapped, total: rows.length, withIssues: rows.filter((r) => r.issues.length).length };
}
