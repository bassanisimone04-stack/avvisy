import { ARTICLES } from "./mock-articles";
import { getLocalizedArticle } from "./i18n/content-article";
import type { Article, Category } from "./types";
import type { Locale } from "./i18n/locale";

/**
 * Collegamenti interni tra directory, prodotti e guide. Tutto deriva dai link
 * che gli articoli contengono davvero: se un articolo cita una scheda locale o
 * un prodotto, quella scheda mostra l'articolo (e viceversa), senza elenchi
 * scritti a mano che si disallineano col tempo.
 */

const bySlug = (slug: string): Article | undefined => ARTICLES.find((a) => a.slug === slug);

function articlesLinking(fragment: string, locale: Locale, exclude?: (a: Article) => boolean): Article[] {
  return ARTICLES.filter((a) => a.contentHtml.includes(fragment) && !(exclude?.(a)))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .map((a) => getLocalizedArticle(a, locale));
}

/** Articoli (IT/EN) che citano una scheda locale. */
export function guidesMentioningBusiness(slug: string, locale: Locale): Article[] {
  return articlesLinking(`href="/directory/${slug}"`, locale);
}

/** Articoli (IT/EN) che citano un prodotto, escluse le ricette (hanno già la loro sezione). */
export function guidesMentioningProduct(slug: string, locale: Locale): Article[] {
  return articlesLinking(`href="/prodotti/${slug}"`, locale, (a) => a.category === "Ricette");
}

// Guide da proporre su ogni categoria della directory (slug degli articoli).
const CATEGORY_GUIDES: Partial<Record<Category, string[]>> = {
  ristorante: [
    "senza-glutine-vicino-a-me-come-trovare-ristoranti-negozi-e-farmacie",
    "certificazione-aic-cosa-significa-e-come-riconoscere-un-locale-davvero-certificato",
    "come-evitare-la-contaminazione-crociata-al-ristorante-la-guida-completa-per-mangiare-senza-glutine-in-sicurezza",
  ],
  pizzeria: [
    "pizza-senza-glutine-dove-mangiarla-e-come-riconoscerla-sicura",
    "pizza-senza-glutine-fatta-in-casa-l-impasto-con-il-mix-universale",
  ],
  gelateria: [
    "gelato-senza-glutine-lattosio-marche-torta-gelato",
    "gelaterie-senza-glutine-come-riconoscere-quelle-davvero-senza-contaminazione-crociata",
  ],
  "bar-pasticceria": [
    "pasticcerie-senza-glutine-come-riconoscere-quelle-sicure-e-dove-trovarle",
    "pane-senza-glutine-come-sceglierlo-dove-comprarlo-e-conservarlo",
    "dove-fare-colazione-senza-glutine-cornetti-brioches-e-pasticcerie-dedicate",
  ],
  hotel: [
    "hotel-e-villaggi-turistici-certificati-aic-per-celiaci-come-scegliere-una-vacanza-senza-pensieri",
    "le-migliori-citta-italiane-per-una-vacanza-senza-glutine",
  ],
  farmacia: [
    "dove-comprare-prodotti-senza-glutine-supermercati-farmacie-e-negozi-specializzati",
    "quanto-costa-la-dieta-senza-glutine-guida-a-costi-buoni-pasto-aic-e-detrazioni-fiscali",
  ],
  negozio: [
    "dove-comprare-prodotti-senza-glutine-supermercati-farmacie-e-negozi-specializzati",
    "pane-senza-glutine-come-sceglierlo-dove-comprarlo-e-conservarlo",
  ],
  supermercato: [
    "dove-comprare-prodotti-senza-glutine-supermercati-farmacie-e-negozi-specializzati",
    "spesa-senza-glutine-al-discount-aldi-lidl-ed-eurospin-a-confronto",
  ],
};

// Guida di riferimento per le città che ne hanno una.
const CITY_GUIDES: Record<string, string> = {
  Milano: "i-migliori-ristoranti-e-pizzerie-senza-glutine-a-milano-la-guida-completa-2026",
  Roma: "i-migliori-ristoranti-e-pizzerie-senza-glutine-a-roma-la-guida-completa-2026",
  Napoli: "dove-mangiare-senza-glutine-a-napoli-pizza-sfogliatelle-e-baba-senza-rinunce",
  Venezia: "venezia-senza-glutine-dove-mangiare-tra-cicchetti-pizza-e-colazione-in-hotel",
  Bari: "bari-senza-glutine-focaccia-panzerotti-e-pizza-in-teglia-senza-rinunce",
  Palermo: "palermo-senza-glutine-pizzerie-arancini-e-gelato-per-una-citta-a-misura-di-celiaco",
  Genova: "genova-senza-glutine-pizza-focaccia-e-forno-dedicato-tra-i-quartieri-della-citta",
  Verona: "verona-senza-glutine-cosa-mangiare-tra-arena-centro-storico-e-negozi-specializzati",
  Bologna: "le-migliori-citta-italiane-per-una-vacanza-senza-glutine",
};

/** Guide pertinenti a una pagina della directory filtrata per città e/o categoria. */
export function guidesForDirectory(city: string | undefined, category: Category | undefined, locale: Locale): Article[] {
  const slugs: string[] = [];
  if (city && CITY_GUIDES[city]) slugs.push(CITY_GUIDES[city]);
  if (category) slugs.push(...(CATEGORY_GUIDES[category] ?? []));
  return [...new Set(slugs)]
    .map(bySlug)
    .filter((a): a is Article => !!a)
    .slice(0, 4)
    .map((a) => getLocalizedArticle(a, locale));
}
