import { hasZipCodes, type Groomer } from "@/lib/groomers";
import type { Faq } from "@/data/faqs";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { safeExternalUrl, serializeJsonLd } from "@/lib/safe-output";

/**
 * Renders a JSON-LD <script> tag. Safe to call multiple times per page.
 *
 * Serialization goes through serializeJsonLd, which escapes "<" — plain
 * JSON.stringify would let a listing field containing "</script>" break out
 * of the block and inject markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
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
  const website = safeExternalUrl(groomer.website);

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${pageUrl}#business`,
    name: groomer.name,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: groomer.city,
      addressRegion: groomer.state,
      addressCountry: "US",
    },
    additionalType: "https://schema.org/PetGroomingService",
    // Every field below is omitted rather than emitted empty or fabricated —
    // an unclaimed listing genuinely does not have most of this yet, and a
    // search engine should see that absence rather than a placeholder.
    ...(groomer.about ? { description: groomer.about } : {}),
    ...(groomer.phone ? { telephone: groomer.phone } : {}),
    ...(website ? { sameAs: [website] } : {}),
    ...(hasZipCodes(groomer)
      ? {
          areaServed: groomer.zipCodes?.map((zip) => ({
            "@type": "PostalCodeRange",
            postalCode: zip,
          })),
        }
      : {}),
    ...(groomer.priceRange ? { priceRange: groomer.priceRange } : {}),
    ...(groomer.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: groomer.rating,
            reviewCount: groomer.reviewCount,
          },
        }
      : {}),
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
