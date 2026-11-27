/**
 * Indice compatto dei contenuti per l'assistente del sito (chat senza server).
 * Viene generato in fase di build (assistente.json / en/assistente.json) e scaricato solo quando
 * il visitatore apre la chat. L'assistente risponde SOLO con questi dati: niente testi inventati.
 */
import { getCollection } from "astro:content";
import type { Lang } from "../i18n/ui";
import { path } from "../i18n/ui";
import { slugify, tipoLabel, filmIdsDiLocale } from "./utils";
import { tFilmTitolo, tLocaleDesc, tCitta } from "../i18n/content-en";
import { tRegione } from "./mappa-content";

const breve = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

export async function buildAssistenteIndex(lang: Lang) {
  const locali = await getCollection("restaurants");
  const films = await getCollection("films");
  const blog = (await getCollection("blog")).filter((b) => !b.data.bozza && (lang === "en" ? b.data.lang === "en" : b.data.lang !== "en"));

  const venues = locali.map((l) => ({
    id: l.id,
    n: l.data.nome,
    c: tCitta(l.data.citta, lang),
    cs: slugify(l.data.citta),
    r: tRegione(l.data.regione, lang),
    t: tipoLabel(l.data.tipo, lang),
    tk: l.data.tipo,
    k: l.data.categoria === "set-reale" ? "s" : l.data.categoria === "legato-al-film" ? "l" : "a",
    x: l.data.stato !== "aperto" ? 1 : 0,
    p: l.data.prezzo,
    f: filmIdsDiLocale(l),
    d: breve(tLocaleDesc(l, lang), 130),
    u: path(`/locale/${l.id}`, lang),
  }));

  const nVen = new Map<string, number>();
  for (const l of locali) for (const id of filmIdsDiLocale(l)) nVen.set(id, (nVen.get(id) ?? 0) + 1);
  const filmList = films
    .filter((f) => nVen.has(f.id))
    .map((f) => ({
      id: f.id,
      t: tFilmTitolo(f, lang),
      a: lang === "en" ? f.data.titolo : tFilmTitolo(f, "en"), // titolo nell'altra lingua, per riconoscerlo comunque
      y: f.data.anno,
      s: f.data.serieTv ? 1 : 0,
      c: f.data.citta.map((c) => tCitta(c, lang)),
      v: nVen.get(f.id) ?? 0,
      u: path(`/film/${f.id}`, lang),
    }));

  const cittaMap = new Map<string, { n: string; s: string; v: number; r: string; it: string }>();
  for (const l of locali) {
    const e = cittaMap.get(l.data.citta) ?? { n: tCitta(l.data.citta, lang), s: slugify(l.data.citta), v: 0, r: tRegione(l.data.regione, lang), it: l.data.citta };
    e.v++;
    cittaMap.set(l.data.citta, e);
  }

  const articles = blog.map((a) => ({
    id: a.id,
    t: a.data.titolo,
    d: breve(a.data.descrizione, 140),
    g: a.data.tags ?? [],
    u: path(`/blog/${a.id.replace(/-en$/, "")}`, lang),
  }));

  const regioni = [...new Set(locali.map((l) => l.data.regione))].map((r) => ({ it: r, n: tRegione(r, lang) }));

  return {
    lang,
    stats: { venues: locali.length, cities: cittaMap.size, films: filmList.length, regions: regioni.length },
    venues,
    films: filmList,
    cities: [...cittaMap.values()],
    regions: regioni,
    articles,
  };
}
