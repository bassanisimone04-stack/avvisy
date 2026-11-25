/** Catalog data access — demo data in Phase 1, Supabase in Phase 4. */
import { demoProducts } from "@/data/demo/products";
import type { Difficulty, FileFormat, Product, ProductCategorySlug } from "./types";

export function listProducts(): Product[] {
  return demoProducts.filter((p) => p.status === "published");
}

export function getProduct(slug: string): Product | undefined {
  return demoProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(p: Product, limit = 3): Product[] {
  return p.related.map(getProduct).filter((x): x is Product => Boolean(x)).slice(0, limit);
}

export interface CatalogQuery {
  q?: string;
  category?: ProductCategorySlug | "";
  format?: FileFormat | "";
  difficulty?: Difficulty | "";
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "title";
  vertical?: string;
}

export function parseCatalogQuery(sp: Record<string, string | string[] | undefined>): CatalogQuery {
  const one = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.slice(0, 80) ?? "";
  };
  const maxPrice = Number(one("max"));
  const sort = one("sort");
  return {
    q: one("q"),
    category: one("category") as ProductCategorySlug,
    format: one("format") as FileFormat,
    difficulty: one("difficulty") as Difficulty,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    sort: (["featured", "price-asc", "price-desc", "title"].includes(sort) ? sort : "featured") as CatalogQuery["sort"],
  };
}

export function searchCatalog(products: Product[], q: CatalogQuery): Product[] {
  const text = q.q?.toLowerCase().trim();
  const out = products
    .filter((p) => !q.vertical || p.vertical === q.vertical)
    .filter((p) => !q.category || p.category === q.category)
    .filter((p) => !q.format || p.formats.includes(q.format))
    .filter((p) => !q.difficulty || p.difficulty === q.difficulty)
    .filter((p) => !q.maxPrice || p.prices.personal <= q.maxPrice * 100)
    .filter((p) => !text || [p.title, p.subtitle, ...p.materials, ...p.formats].join(" ").toLowerCase().includes(text));
  switch (q.sort) {
    case "price-asc":
      return out.sort((a, b) => a.prices.personal - b.prices.personal);
    case "price-desc":
      return out.sort((a, b) => b.prices.personal - a.prices.personal);
    case "title":
      return out.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return out;
  }
}
