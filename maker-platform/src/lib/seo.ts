import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { Product } from "@/features/catalog/types";

/**
 * Builds page metadata with canonical URL and Open Graph.
 * `index: false` (or the global allowIndexing switch) adds noindex.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
  image,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  image?: string;
}): Metadata {
  const canIndex = siteConfig.allowIndexing && index;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: canIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function breadcrumbJsonLd(items: { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

/**
 * Product structured data. Returns null for demo products: structured data
 * must describe real offers only. No ratings/reviews are ever invented.
 */
export function productJsonLd(p: Product) {
  if (p.isDemo) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.subtitle,
    image: absoluteUrl(p.cover),
    sku: p.slug,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      price: (p.prices.personal / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/shop/${p.slug}`),
    },
  };
}
