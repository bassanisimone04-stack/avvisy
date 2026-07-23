import type { CollectionEntry } from "astro:content";

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

/** Etichetta leggibile per lo stato di apertura. */
export function statoLabel(stato: string): string {
  switch (stato) {
    case "aperto":
      return "Aperto";
    case "chiuso":
      return "Chiuso";
    case "temporaneamente-chiuso":
      return "Temporaneamente chiuso";
    default:
      return stato;
  }
}

/** Etichetta leggibile per la categoria. */
export function categoriaLabel(categoria: string): string {
  return categoria === "a-tema-cinema" ? "A tema cinema" : "Set reale";
}

/** Formatta una data in italiano (es. "12 marzo 2025"). */
export function formatData(data: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
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
