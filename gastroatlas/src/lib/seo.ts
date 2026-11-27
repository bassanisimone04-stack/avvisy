import type { Metadata } from "next";
import { BRAND } from "@/data/catalog";
import { LOCALES, T, type Locale } from "./i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3300").replace(/\/$/, "");
/** The catalogue is fictional, so the whole site stays out of search engines until real data replaces it. */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export function meta(locale: Locale, path: string, heading?: string, description?: string): Metadata {
  const t = T(locale);
  const p = path ? `${path.replace(/^\/|\/$/g, "")}/` : "";
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/${p}`]));
  languages["x-default"] = `${SITE_URL}/it/${p}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: heading ? `${heading} | ${BRAND.short}` : BRAND.short,
    description: description ?? t("GastroAtlas, an editorial guide to culinary destinations and fine dining.", "GastroAtlas, guida editoriale alle destinazioni gastronomiche e al fine dining."),
    alternates: { canonical: `${SITE_URL}/${locale}/${p}`, languages },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
    icons: { icon: "/assets/icon.svg" },
  };
}
