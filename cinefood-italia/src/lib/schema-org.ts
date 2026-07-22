import type { Restaurant } from "./utils";
import { SITE } from "../config/site";

/**
 * Costruisce i "dati strutturati" Schema.org di tipo Restaurant.
 * Servono a Google per capire che la pagina descrive un ristorante,
 * con indirizzo, posizione geografica e i film in cui appare.
 *
 * @param locale  La scheda del ristorante.
 * @param canonicalUrl  L'URL completo della pagina di dettaglio.
 * @param immagineUrl  L'URL completo dell'immagine principale.
 */
export function restaurantJsonLd(
  locale: Restaurant,
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
    // Collega il locale alle opere (film/serie) in cui appare.
    subjectOf: d.film.map((f) => ({
      "@type": f.serieTv ? "TVSeries" : "Movie",
      name: f.titolo,
      datePublished: String(f.anno),
      director: {
        "@type": "Person",
        name: f.regista,
      },
    })),
  };
}

/** Dati strutturati generici per un articolo del blog (BlogPosting). */
export function blogPostingJsonLd(
  titolo: string,
  descrizione: string,
  autore: string,
  data: Date,
  canonicalUrl: string,
  immagineUrl?: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: titolo,
    description: descrizione,
    author: { "@type": "Person", name: autore },
    datePublished: data.toISOString(),
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
    ...(immagineUrl ? { image: immagineUrl } : {}),
  };
}

/** Dati strutturati dell'organizzazione/sito (per la home). */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
  };
}
