import type { CollectionEntry } from "astro:content";

export type Restaurant = CollectionEntry<"restaurants">;

/** Trasforma un testo in uno "slug" adatto agli URL (minuscolo, senza accenti). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // rimuove gli accenti
    .replace(/[^a-z0-9]+/g, "-") // sostituisce simboli/spazi con "-"
    .replace(/^-+|-+$/g, ""); // toglie i "-" a inizio/fine
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
    if (a.data.inEvidenza !== b.data.inEvidenza) {
      return a.data.inEvidenza ? -1 : 1;
    }
    return a.data.nome.localeCompare(b.data.nome, "it");
  });
}

/** Restituisce l'elenco unico e ordinato delle città presenti. */
export function cittaUniche(locali: Restaurant[]): string[] {
  const set = new Set(locali.map((l) => l.data.citta));
  return [...set].sort((a, b) => a.localeCompare(b, "it"));
}

/** Restituisce l'elenco unico e ordinato dei tipi di locale presenti. */
export function tipiUnici(locali: Restaurant[]): string[] {
  const set = new Set(locali.map((l) => l.data.tipo));
  return [...set].sort((a, b) => a.localeCompare(b, "it"));
}

/**
 * Restituisce l'elenco unico dei film/serie presenti, con lo slug,
 * l'anno e quanti locali vi appaiono.
 */
export function filmUnici(
  locali: Restaurant[]
): { titolo: string; slug: string; anno: number; count: number }[] {
  const mappa = new Map<
    string,
    { titolo: string; slug: string; anno: number; count: number }
  >();
  for (const locale of locali) {
    for (const film of locale.data.film) {
      const slug = slugify(film.titolo);
      const esistente = mappa.get(slug);
      if (esistente) {
        esistente.count += 1;
      } else {
        mappa.set(slug, {
          titolo: film.titolo,
          slug,
          anno: film.anno,
          count: 1,
        });
      }
    }
  }
  return [...mappa.values()].sort((a, b) =>
    a.titolo.localeCompare(b.titolo, "it")
  );
}

/** Filtra i locali che appaiono in un film (identificato dal suo slug). */
export function localiPerFilm(
  locali: Restaurant[],
  filmSlug: string
): Restaurant[] {
  return locali.filter((l) =>
    l.data.film.some((f) => slugify(f.titolo) === filmSlug)
  );
}

/** Estrae lo slug/id di un locale (usato negli URL /locali/[slug]). */
export function localeSlug(locale: Restaurant): string {
  return locale.id;
}
