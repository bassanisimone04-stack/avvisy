import { BUSINESSES } from "./mock-businesses";
import { ARTICLES } from "./mock-articles";
import { REGIONS } from "./regions";
import { CATEGORIES } from "./categories";

export type SearchResultType = "attivita" | "articolo" | "citta" | "regione" | "categoria";

export interface SearchResult {
  type: SearchResultType;
  label: string;
  sublabel?: string;
  href: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const b of BUSINESSES) {
    results.push({ type: "attivita", label: b.name, sublabel: `${b.city} · ${b.province}`, href: `/directory/${b.slug}` });
  }
  for (const a of ARTICLES) {
    results.push({ type: "articolo", label: a.title, sublabel: a.category, href: `/blog/${a.slug}` });
  }
  const seenCities = new Set<string>();
  for (const r of REGIONS) {
    results.push({ type: "regione", label: r.name, sublabel: "Regione", href: `/directory?regione=${r.slug}` });
    for (const p of r.provinces) {
      for (const c of p.comuni) {
        if (seenCities.has(c)) continue;
        seenCities.add(c);
        results.push({ type: "citta", label: c, sublabel: `${p.name}, ${r.name}`, href: `/directory?comune=${encodeURIComponent(c)}` });
      }
    }
  }
  for (const c of CATEGORIES) {
    results.push({ type: "categoria", label: c.labelPlural, sublabel: "Categoria", href: `/directory?categoria=${c.slug}` });
  }
  return results;
}

const INDEX = buildIndex();

export function searchAutocomplete(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = INDEX.map((item) => {
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
