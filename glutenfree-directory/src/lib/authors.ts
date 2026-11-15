import { slugify } from "./format";
import type { Locale } from "./i18n/locale";

export interface AuthorInfo {
  slug: string;
  name: string;
  bio: string;
  bioEn: string;
}

export const AUTHORS: AuthorInfo[] = [
  {
    slug: slugify("Redazione Mappa Senza Glutine"),
    name: "Redazione Mappa Senza Glutine",
    bio: "La redazione scrive guide su celiachia, sicurezza alimentare e vita senza glutine basandosi su fonti ufficiali (AIC, Ministero della Salute, normativa vigente) e verifiche dirette, senza dati inventati.",
    bioEn: "The editorial team writes guides on celiac disease, food safety and gluten-free life based on official sources (AIC, Ministero della Salute, current regulations) and direct verification, with no invented data.",
  },
];

export function getAuthorByName(name: string): AuthorInfo | undefined {
  return AUTHORS.find((a) => a.name === name);
}

export function getAuthorBySlug(slug: string): AuthorInfo | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

export function authorBio(author: AuthorInfo, locale: Locale): string {
  return locale === "en" ? author.bioEn : author.bio;
}
