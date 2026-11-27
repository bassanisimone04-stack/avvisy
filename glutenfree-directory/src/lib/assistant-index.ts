import { BUSINESSES } from "./mock-businesses";
import { ARTICLES } from "./mock-articles";
import { CATEGORIES, categoryLabelPlural } from "./categories";
import { FAQ_GROUPS_IT, FAQ_GROUPS_EN } from "./faq-page-content";
import { HOME_FAQS } from "./mock-site";
import { HOME_FAQS_EN } from "./i18n/content-site";
import { getLocalizedArticle } from "./i18n/content-article";
import { getLocalizedBusiness } from "./i18n/content-business";
import { cityName } from "./i18n/place-names";
import type { Locale } from "./i18n/locale";

/**
 * Indice compatto dei contenuti del sito per l'assistente: solo dati già
 * pubblicati (locali, articoli, FAQ). L'assistente non inventa nulla: risponde
 * scegliendo tra questi elementi.
 */
export interface AssistantIndex {
  venues: { n: string; s: string; city: string; cityKey: string; k: string; aic: boolean; d: string }[];
  articles: { t: string; s: string; k: string; e: string }[];
  faqs: { q: string; a: string }[];
  categories: { slug: string; label: string }[];
  cities: { key: string; label: string }[];
}

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

export function buildAssistantIndex(locale: Locale): AssistantIndex {
  const venues = BUSINESSES.map((b) => getLocalizedBusiness(b, locale)).map((b) => ({
    n: b.name,
    s: b.slug,
    city: cityName(b.city, locale),
    cityKey: b.city,
    k: b.category,
    aic: b.aicCertified,
    d: cut(b.shortDescription, 140),
  }));
  const articles = ARTICLES.map((a) => getLocalizedArticle(a, locale)).map((a) => ({
    t: a.title,
    s: a.slug,
    k: a.category,
    e: cut(a.excerpt, 160),
  }));
  const groups = locale === "en" ? FAQ_GROUPS_EN : FAQ_GROUPS_IT;
  const faqs = [...groups.flatMap((g) => g.items), ...(locale === "en" ? HOME_FAQS_EN : HOME_FAQS)].map((f) => ({ q: f.question, a: f.answer }));
  const cityKeys = [...new Set(BUSINESSES.map((b) => b.city))];
  return {
    venues,
    articles,
    faqs,
    categories: CATEGORIES.map((c) => ({ slug: c.slug, label: categoryLabelPlural(c, locale) })),
    cities: cityKeys.map((k) => ({ key: k, label: cityName(k, locale) })),
  };
}
