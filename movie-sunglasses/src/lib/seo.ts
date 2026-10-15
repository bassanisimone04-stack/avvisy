import type { Metadata } from "next";
import { SITE, LOCALES } from "./site";
import { truncate } from "./format";

interface Opts { title: string; description: string; path: string; noindex?: boolean; type?: "website" | "article"; absoluteTitle?: boolean }

export function buildMetadata({ title, description, path, noindex, type = "website", absoluteTitle }: Opts): Metadata {
  const url = SITE.url + path;
  const full = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: truncate(description, 158),
    alternates: {
      canonical: url,
      // hreflang is ready for future locales: add entries to LOCALES and translated routes.
      languages: Object.fromEntries([...LOCALES.map((l) => [l.code, SITE.url + l.path + path]), ["x-default", url]]),
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: full, description: truncate(description, 200), url, siteName: SITE.name, locale: "en_US", type },
    twitter: { card: "summary_large_image", title: full, description: truncate(description, 200) },
  };
}
