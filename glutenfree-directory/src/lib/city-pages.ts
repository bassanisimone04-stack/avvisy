import { BUSINESSES } from "./mock-businesses";
import { getCategoryInfo, categoryLabel, categoryLabelPlural } from "./categories";
import { cityName } from "./i18n/place-names";
import type { Locale } from "./i18n/locale";

/**
 * Pagine città con indirizzo pulito (/senza-glutine/roma). Esistono solo per
 * le città con almeno MIN_CITY_VENUES locali verificati: con meno risultati la
 * pagina sarebbe quasi vuota e resta raggiungibile solo dai filtri della
 * directory. Tutti i numeri e i nomi del testo derivano dai dati reali.
 */
export const MIN_CITY_VENUES = 2;

export function citySlug(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Città con pagina dedicata, dalla più ricca di locali alla meno. */
export function cityPageCities(): string[] {
  const counts = new Map<string, number>();
  for (const b of BUSINESSES) counts.set(b.city, (counts.get(b.city) ?? 0) + 1);
  return [...counts]
    .filter(([, n]) => n >= MIN_CITY_VENUES)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([city]) => city);
}

export function cityFromSlug(slug: string): string | undefined {
  return cityPageCities().find((c) => citySlug(c) === slug);
}

/** Percorso IT (senza prefisso lingua) dell'elenco di una città. */
export function cityPath(city: string): string {
  return cityPageCities().includes(city)
    ? `/senza-glutine/${citySlug(city)}`
    : `/directory?comune=${encodeURIComponent(city)}`;
}

const join = (items: string[], and: string) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;

/** Testo introduttivo della pagina città, costruito solo con i dati della directory. */
export function cityIntro(city: string, locale: Locale): string {
  const en = locale === "en";
  const list = BUSINESSES.filter((b) => b.city === city);
  const n = list.length;
  const nAic = list.filter((b) => b.aicCertified).length;
  const label = cityName(city, locale);

  const catCounts = new Map<string, number>();
  for (const b of list) catCounts.set(b.category, (catCounts.get(b.category) ?? 0) + 1);
  const cats = [...catCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug, c]) => {
      const info = getCategoryInfo(slug);
      // "1 pizzeria" ma "3 pizzerie": singolare quando il conteggio è 1.
      const name = info ? (c === 1 ? categoryLabel(info, locale) : categoryLabelPlural(info, locale)).toLowerCase() : slug;
      return `${c} ${name}`;
    });

  const top = [...list]
    .filter((b) => b.reviewCount > 0)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 3)
    .map((b) => b.name);

  if (en) {
    const aic = nAic > 0 ? ` ${nAic} ${nAic === 1 ? "is" : "are"} marked as AIC-certified.` : "";
    const best = top.length >= 2 ? ` The best-reviewed so far: ${join(top, "and")}.` : "";
    return `Mappa Senza Glutine lists ${n} verified gluten-free venues in ${label}: ${join(cats, "and")}.${aic}${best} Each listing shows address, opening hours, phone number and how gluten-free food is prepared. Before you go, check the certification on the official AIC list and tell the staff about your needs.`;
  }
  const aic = nAic > 0 ? ` ${nAic === 1 ? "1 è segnalato come certificato" : `${nAic} sono segnalati come certificati`} AIC.` : "";
  const best = top.length >= 2 ? ` I meglio recensiti finora: ${join(top, "e")}.` : "";
  return `Su Mappa Senza Glutine trovi ${n} locali senza glutine verificati a ${label}: ${join(cats, "e")}.${aic}${best} Ogni scheda riporta indirizzo, orari, telefono e come viene preparato il senza glutine. Prima di andare, controlla la certificazione sull'elenco ufficiale AIC e avvisa sempre il personale della tua esigenza.`;
}
