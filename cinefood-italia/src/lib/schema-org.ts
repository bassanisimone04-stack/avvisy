import type { Restaurant, Film } from "./utils";
import { SITE } from "../config/site";

/**
 * Dati strutturati Schema.org di tipo Restaurant, con indirizzo, geo e
 * collegamento alle opere (film/serie) in cui il locale appare.
 *
 * @param locale       La scheda del ristorante.
 * @param film         I film collegati (già risolti dalla collection).
 * @param canonicalUrl URL completo della pagina di dettaglio.
 * @param immagineUrl  URL completo dell'immagine principale.
 */
export function restaurantJsonLd(
  locale: Restaurant,
  film: Film[],
  canonicalUrl: string,
  immagineUrl: string
): Record<string, unknown> {
  const d = locale.data;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: d.nome,
    description: d.descrizione,
    image: immagineUrl,
    url: canonicalUrl,
    priceRange: d.prezzo,
    address: {
      "@type": "PostalAddress",
      streetAddress: d.indirizzo,
      addressLocality: d.citta,
      addressRegion: d.regione,
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: d.coordinate.lat,
      longitude: d.coordinate.lng,
    },
    ...(d.sitoWeb ? { sameAs: d.sitoWeb } : {}),
    subjectOf: film.map((f) => ({
      "@type": f.data.serieTv ? "TVSeries" : "Movie",
      name: f.data.titolo,
      datePublished: String(f.data.anno),
      director: { "@type": "Person", name: f.data.regista },
    })),
  };
}

/** Dati strutturati FAQPage (per le pagine film). */
export function faqPageJsonLd(
  faq: { domanda: string; risposta: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };
}

/** Dati strutturati BreadcrumbList. */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Dati strutturati per un articolo del blog (BlogPosting). */
export function blogPostingJsonLd(
  titolo: string,
  descrizione: string,
  autore: string,
  data: Date,
  canonicalUrl: string,
  immagineUrl?: string,
  dataModifica?: Date
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: titolo,
    description: descrizione,
    // "Redazione ..." / "... Editorial Team" non sono persone: dichiararle come Organization.
    author: /redazione|editorial|cinefood/i.test(autore)
      ? { "@type": "Organization", name: autore, url: SITE.url }
      : { "@type": "Person", name: autore },
    datePublished: data.toISOString(),
    dateModified: (dataModifica ?? data).toISOString(),
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: new URL("/logo.png", SITE.url).href },
    },
    ...(immagineUrl ? { image: immagineUrl } : {}),
  };
}

/** Dati strutturati del sito, con azione di ricerca (per la home). */
export function websiteJsonLd(): Record<string, unknown> {
  // Link ai profili social non vuoti (per l'Organization editrice).
  const sameAs = (Object.values(SITE.social) as string[]).filter((u) => u.length > 0);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: "CineFood",
    description: SITE.description,
    url: SITE.url,
    inLanguage: ["it", "en"],
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: new URL("/logo.png", SITE.url).href,
      },
      ...(sameAs.length ? { sameAs } : {}),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/locali?cerca={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Dati strutturati ItemList per le pagine elenco (film, locali).
 * `urls` sono URL assoluti degli elementi, nell'ordine mostrato.
 */
export function itemListJsonLd(nome: string, urls: string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nome,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url,
    })),
  };
}
