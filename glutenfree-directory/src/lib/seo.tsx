import type { Metadata } from "next";
import type { Article, Business, FaqItem, Product } from "./types";
import { SITE_NAME, SITE_URL } from "./site-config";
import { localeHref, type Locale } from "./i18n/locale";

const BRAND_SUFFIX = ` | ${SITE_NAME}`;
// Un titolo corto con le parole chiave in testa rende più di uno lungo con
// il nome del sito in coda (Google mostra circa 60 caratteri). Il brand
// resta nel <title> solo se l'intero titolo sta entro questo limite.
const MAX_BRANDED_TITLE = 58;

/** Titolo finale: parole chiave per prime, brand solo se ci sta senza allungarlo. */
export function seoTitle(title: string): string {
  const core = title.endsWith(BRAND_SUFFIX) ? title.slice(0, -BRAND_SUFFIX.length) : title;
  if (core.includes(SITE_NAME)) return core;
  return core.length + BRAND_SUFFIX.length <= MAX_BRANDED_TITLE ? `${core}${BRAND_SUFFIX}` : core;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  locale = "it",
}: {
  title: string;
  description: string;
  /** Percorso canonico IT, senza prefisso (es. "/directory/foo"). */
  path: string;
  image?: string;
  type?: "website" | "article";
  locale?: Locale;
}): Metadata {
  const url = `${SITE_URL}${localeHref(locale, path)}`;
  const ogImage = image ?? `${SITE_URL}/opengraph-image`;
  // "absolute" impedisce a Next.js di applicare sopra anche il template del
  // layout (`%s · Mappa Senza Glutine`), che duplicherebbe il nome del sito.
  const fullTitle = seoTitle(title);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: {
        it: `${SITE_URL}${localeHref("it", path)}`,
        en: `${SITE_URL}${localeHref("en", path)}`,
        "x-default": `${SITE_URL}${localeHref("it", path)}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "it_IT",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// Tipo schema.org per categoria della directory: usare sempre "Restaurant" per
// farmacie, hotel e gelaterie dichiarava a Google un'attivita' sbagliata.
const SCHEMA_TYPE: Record<Business["category"], string> = {
  ristorante: "Restaurant",
  pizzeria: "Restaurant", // schema.org non ha "Pizzeria": si usa Restaurant + servesCuisine
  "bar-pasticceria": "FoodEstablishment",
  gelateria: "IceCreamShop",
  hotel: "LodgingBusiness",
  farmacia: "Pharmacy",
  negozio: "Store",
  supermercato: "GroceryStore",
};

/**
 * Dati strutturati di una scheda locale. Contiene solo campi presenti e
 * verificati nei dati: niente orari (non ancora verificati uno per uno), niente
 * immagine generica del sito al posto di una foto del locale, niente
 * recensioni se non ce ne sono di reali.
 */
export function localBusinessJsonLd(b: Business) {
  const url = `${SITE_URL}/directory/${b.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[b.category] ?? "LocalBusiness",
    "@id": url,
    name: b.name,
    description: b.description,
    ...(b.category === "pizzeria" ? { servesCuisine: "Pizza" } : {}),
    telephone: b.phone,
    url,
    ...(b.photoUrl ? { image: `${SITE_URL}${b.photoUrl}` } : {}),
    ...(b.website ? { sameAs: [b.website] } : {}),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, ${b.city}`)}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: b.city,
      addressRegion: b.region,
      postalCode: b.postalCode,
      addressCountry: "IT",
    },
    geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
    ...(b.aicCertified
      ? { additionalProperty: [{ "@type": "PropertyValue", name: "Programma AIC Alimentazione Fuori Casa", value: true }] }
      : {}),
    ...(b.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: b.rating,
            reviewCount: b.reviewCount,
          },
        }
      : {}),
    ...(b.reviews.length > 0
      ? {
          review: b.reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            datePublished: r.date,
            reviewBody: r.body,
            name: r.title,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          })),
        }
      : {}),
  };
}

export function articleJsonLd(a: Article) {
  const plainText = a.contentHtml.replace(/<[^>]+>/g, " ");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Person", name: a.author },
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    wordCount,
    timeRequired: `PT${a.readingTime}M`,
    articleSection: a.category,
    keywords: a.tags.join(", "),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
  };
}

export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    image: `${SITE_URL}/opengraph-image`,
    ...(p.reviewCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount } }
      : {}),
    offers: { "@type": "Offer", priceCurrency: "EUR", price: p.price, availability: "https://schema.org/InStock" },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
