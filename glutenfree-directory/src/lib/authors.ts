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
    slug: slugify("Dott.ssa Elena Rossi"),
    name: "Dott.ssa Elena Rossi",
    bio: "Biologa nutrizionista specializzata in intolleranze alimentari, scrive su GlutenFree Directory guide basate su evidenze scientifiche su celiachia, alimentazione e salute.",
    bioEn: "Nutritionist and biologist specializing in food intolerances, writing evidence-based guides for GlutenFree Directory on celiac disease, nutrition and health.",
  },
  {
    slug: slugify("Marco Bianchi"),
    name: "Marco Bianchi",
    bio: "Content specialist su sicurezza alimentare e normativa, con un occhio di riguardo per etichette, viaggi e novità del settore senza glutine.",
    bioEn: "Content specialist in food safety and regulation, with a focus on labels, travel and news from the gluten-free world.",
  },
  {
    slug: slugify("Giulia Ferri"),
    name: "Giulia Ferri",
    bio: "Food blogger gluten free, condivide ricette testate in prima persona e i prodotti senza glutine che ama davvero.",
    bioEn: "Gluten-free food blogger, sharing personally tested recipes and the gluten-free products she truly loves.",
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
