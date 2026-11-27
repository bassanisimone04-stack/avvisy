import type { Metadata } from "next";
import { BRAND, SITE_URL, type Locale } from "@/config/brand";
import { LOCALES } from "@/i18n";

type Args = {
  locale: Locale;
  /** path WITHOUT locale prefix, starting with "/" (e.g. "/restaurants/") */
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** override canonical (full path incl. locale, may include whitelisted query) */
  canonical?: string;
  /** locales where this page exists (defaults to all) */
  locales?: readonly Locale[];
  image?: string;
  type?: "website" | "article";
};

/** Unique title/description, self-referencing canonical, reciprocal hreflang + x-default, OG/Twitter. */
export function buildMetadata(a: Args): Metadata {
  const locales = a.locales ?? LOCALES;
  const canonical = a.canonical ?? `/${a.locale}${a.path}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${a.path}`;
  languages["x-default"] = `${SITE_URL}/${BRAND.defaultLocale}${a.path}`;
  const fullTitle = a.title.includes(BRAND.name) ? a.title : `${a.title} | ${BRAND.name}`;
  const image = a.image ?? `/api/og/?title=${encodeURIComponent(a.title.slice(0, 90))}`;
  return {
    title: { absolute: fullTitle },
    description: a.description,
    alternates: { canonical: `${SITE_URL}${canonical}`, languages },
    robots: a.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: fullTitle, description: a.description, url: `${SITE_URL}${canonical}`, siteName: BRAND.name, locale: a.locale === "it" ? "it_IT" : "en_GB", type: a.type ?? "website", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: fullTitle, description: a.description, images: [image] },
  };
}
