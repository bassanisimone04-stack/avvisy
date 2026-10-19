import type { Metadata } from "next";
import { SITE, LOCALES } from "./site";
import { truncate } from "./format";
import { fitTitle } from "./seo-copy";

interface Opts { title: string; description: string; path: string; noindex?: boolean; type?: "website" | "article"; absoluteTitle?: boolean }

export function buildMetadata({ title, description, path, noindex, type = "website", absoluteTitle }: Opts): Metadata {
  const url = SITE.url + path;
  const full = absoluteTitle ? title : fitTitle(title);
  return {
    title: { absolute: absoluteTitle ? title : fitTitle(title) },
    description: truncate(description, 158),
    alternates: {
      canonical: url,
      // hreflang is ready for future locales: add entries to LOCALES and translated routes.
      languages: Object.fromEntries([...LOCALES.map((l) => [l.code, SITE.url + l.path + path]), ["x-default", url]]),
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: { title: full, description: truncate(description, 200), url, siteName: SITE.name, locale: "en_US", type },
    twitter: { card: "summary_large_image", title: full, description: truncate(description, 200) },
  };
}
