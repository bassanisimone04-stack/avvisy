import type { Groomer } from "@/lib/groomers";
import type { Faq } from "@/data/faqs";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

/** Renders a JSON-LD <script> tag. Safe to call multiple times per page. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [],
  };
}

export function faqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/**
 * LocalBusiness / HomeAndConstructionBusiness markup for a single mobile
 * groomer listing page. Mobile grooming is modeled as a service delivered
 * at the customer's home, so areaServed carries the zip code coverage.
 */
export function localBusinessJsonLd(groomer: Groomer, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${pageUrl}#business`,
    name: groomer.name,
    description: groomer.about,
    url: pageUrl,
    telephone: groomer.phone,
    ...(groomer.website ? { sameAs: [groomer.website] } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: groomer.city,
      addressRegion: groomer.state,
      addressCountry: "US",
    },
    areaServed: groomer.zipCodes.map((zip) => ({
      "@type": "PostalCodeRange",
      postalCode: zip,
    })),
    priceRange: groomer.priceRange,
    aggregateRating: groomer.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: groomer.rating,
          reviewCount: groomer.reviewCount,
        }
      : undefined,
    additionalType: "https://schema.org/PetGroomingService",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
