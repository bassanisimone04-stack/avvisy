import type { Metadata } from "next";
import type { Article, Business, FaqItem, Product } from "./types";
import { SITE_NAME, SITE_URL } from "./site-config";
import { localeHref, type Locale } from "./i18n/locale";

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
  return {
    title,
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
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "it_IT",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
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

export function localBusinessJsonLd(b: Business) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/directory/${b.slug}`,
    name: b.name,
    description: b.description,
    image: `${SITE_URL}/opengraph-image`,
    servesCuisine: "Senza glutine",
    priceRange: b.priceRange,
    telephone: b.phone,
    url: `${SITE_URL}/directory/${b.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: b.city,
      addressRegion: b.region,
      postalCode: b.postalCode,
      addressCountry: "IT",
    },
    geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.rating,
      reviewCount: b.reviewCount,
    },
    review: b.reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      name: r.title,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
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
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
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
    sameAs: ["https://instagram.com/glutenfreedirectory", "https://facebook.com/glutenfreedirectory"],
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
