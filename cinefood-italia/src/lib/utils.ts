import type { CollectionEntry } from "astro:content";
import { useT, localeCode, type Lang } from "../i18n/ui";

export type Restaurant = CollectionEntry<"restaurants">;
export type Film = CollectionEntry<"films">;

/** Trasforma un testo in uno "slug" adatto agli URL (minuscolo, senza accenti). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Etichetta leggibile per lo stato di apertura (nella lingua richiesta). */
export function statoLabel(stato: string, lang: Lang = "it"): string {
  const t = useT(lang);
  if (stato === "aperto") return t("stato.aperto");
  if (stato === "chiuso") return t("stato.chiuso");
  if (stato === "temporaneamente-chiuso") return t("stato.tempChiuso");
  return stato;
}

/** Etichetta leggibile per la categoria. */
export function categoriaLabel(categoria: string, lang: Lang = "it"): string {
  const t = useT(lang);
  if (categoria === "a-tema-cinema") return t("badge.aTema");
  if (categoria === "legato-al-film") return t("badge.legato");
  return t("badge.setReale");
}

/** Etichetta del tipo di locale nella lingua richiesta. */
export function tipoLabel(tipo: string, lang: Lang = "it"): string {
  const t = useT(lang);
  const key = `tipo.${tipo}` as Parameters<typeof t>[0];
  return t(key);
}

/** Formatta una data (es. "12 marzo 2025" / "12 March 2025"). */
export function formatData(data: Date, lang: Lang = "it"): string {
  return new Intl.DateTimeFormat(localeCode(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}

/** Ordina i locali: prima gli "in evidenza", poi in ordine alfabetico. */
export function ordinaLocali(locali: Restaurant[]): Restaurant[] {
  return [...locali].sort((a, b) => {
    if (a.data.inEvidenza !== b.data.inEvidenza) return a.data.inEvidenza ? -1 : 1;
    return a.data.nome.localeCompare(b.data.nome, "it");
  });
}

/** Elenco unico e ordinato delle città presenti. */
export function cittaUniche(locali: Restaurant[]): string[] {
  return [...new Set(locali.map((l) => l.data.citta))].sort((a, b) =>
    a.localeCompare(b, "it")
  );
}

/** Elenco unico e ordinato dei tipi di locale presenti. */
export function tipiUnici(locali: Restaurant[]): string[] {
  return [...new Set(locali.map((l) => l.data.tipo))].sort((a, b) =>
    a.localeCompare(b, "it")
  );
}

/** Id (slug) dei film collegati a un locale. */
export function filmIdsDiLocale(locale: Restaurant): string[] {
  return locale.data.film.map((f) => f.film.id);
}

/** Locali che appaiono in un dato film (identificato dal suo slug/id). */
export function localiPerFilm(locali: Restaurant[], filmId: string): Restaurant[] {
  return locali.filter((l) => filmIdsDiLocale(l).includes(filmId));
}

/** Locali di una data città. */
export function localiPerCitta(locali: Restaurant[], citta: string): Restaurant[] {
  return locali.filter((l) => l.data.citta === citta);
}

/** Quanti locali appaiono in ciascun film. */
export function contaLocaliPerFilm(locali: Restaurant[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of locali)
    for (const id of filmIdsDiLocale(l)) m.set(id, (m.get(id) ?? 0) + 1);
  return m;
}

/** La descrizione della scena di un locale per uno specifico film. */
export function scenaPerFilm(locale: Restaurant, filmId: string): string | undefined {
  return locale.data.film.find((f) => f.film.id === filmId)?.descrizioneScena;
}
