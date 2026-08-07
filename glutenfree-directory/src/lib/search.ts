import { BUSINESSES } from "./mock-businesses";
import { ARTICLES } from "./mock-articles";
import { REGIONS } from "./regions";
import { CATEGORIES, categoryLabelPlural } from "./categories";
import { getLocalizedArticle } from "./i18n/content-article";
import { cityName, regionName } from "./i18n/place-names";
import { localeHref, type Locale } from "./i18n/locale";

export type SearchResultType = "attivita" | "articolo" | "citta" | "regione" | "categoria";

export interface SearchResult {
  type: SearchResultType;
  label: string;
  sublabel?: string;
  href: string;
}

const TYPE_LABEL: Record<Locale, Record<SearchResultType, string>> = {
  it: { attivita: "Attività", articolo: "Articolo", citta: "Città", regione: "Regione", categoria: "Categoria" },
  en: { attivita: "Business", articolo: "Article", citta: "City", regione: "Region", categoria: "Category" },
};

export function typeLabel(type: SearchResultType, locale: Locale): string {
  return TYPE_LABEL[locale][type];
}

function buildIndex(locale: Locale): SearchResult[] {
  const results: SearchResult[] = [];

  for (const b of BUSINESSES) {
    results.push({ type: "attivita", label: b.name, sublabel: `${cityName(b.city, locale)} · ${cityName(b.province, locale)}`, href: localeHref(locale, `/directory/${b.slug}`) });
  }
  for (const a of ARTICLES) {
    const la = getLocalizedArticle(a, locale);
    results.push({ type: "articolo", label: la.title, sublabel: la.category, href: localeHref(locale, `/blog/${a.slug}`) });
  }
  const seenCities = new Set<string>();
  for (const r of REGIONS) {
    results.push({ type: "regione", label: regionName(r.name, locale), sublabel: TYPE_LABEL[locale].regione, href: localeHref(locale, `/directory?regione=${r.slug}`) });
    for (const p of r.provinces) {
      for (const c of p.comuni) {
        if (seenCities.has(c)) continue;
        seenCities.add(c);
        results.push({ type: "citta", label: cityName(c, locale), sublabel: `${cityName(p.name, locale)}, ${regionName(r.name, locale)}`, href: localeHref(locale, `/directory?comune=${encodeURIComponent(c)}`) });
      }
    }
  }
  for (const c of CATEGORIES) {
    results.push({ type: "categoria", label: categoryLabelPlural(c, locale), sublabel: TYPE_LABEL[locale].categoria, href: localeHref(locale, `/directory?categoria=${c.slug}`) });
  }
  return results;
}

const INDEX_CACHE: Record<Locale, SearchResult[]> = {
  it: buildIndex("it"),
  en: buildIndex("en"),
};

export function searchAutocomplete(query: string, locale: Locale = "it", limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const index = INDEX_CACHE[locale];
  const scored = index.map((item) => {
    const label = item.label.toLowerCase();
    let score = -1;
    if (label === q) score = 100;
    else if (label.startsWith(q)) score = 80;
    else if (label.includes(q)) score = 50;
    else if (item.sublabel?.toLowerCase().includes(q)) score = 20;
    return { item, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}
