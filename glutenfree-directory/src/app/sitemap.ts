import type { MetadataRoute } from "next";
import { BUSINESSES } from "@/lib/mock-businesses";
import { ARTICLES } from "@/lib/mock-articles";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/mock-products";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site-config";
import { localeHref } from "@/lib/i18n/locale";

function entry(
  path: string,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified?: string },
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${localeHref("it", path)}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        it: `${SITE_URL}${localeHref("it", path)}`,
        en: `${SITE_URL}${localeHref("en", path)}`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "daily", priority: 1 }),
    entry("/directory", { changeFrequency: "daily", priority: 0.9 }),
    entry("/mappa-ristoranti-aic", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/prodotti", { changeFrequency: "weekly", priority: 0.7 }),
    entry("/blog", { changeFrequency: "daily", priority: 0.8 }),
    entry("/faq", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/vivere-senza-glutine", { changeFrequency: "weekly", priority: 0.6 }),
    entry("/contatti", { changeFrequency: "monthly", priority: 0.3 }),
    entry("/per-le-aziende", { changeFrequency: "monthly", priority: 0.4 }),
  ];

  // Pagine categoria con almeno un locale/prodotto reale: hanno un
  // canonical auto-referenziante (vedi directory/page.tsx e prodotti/page.tsx)
  // e ricevono traffico organico proprio, verificato su Search Console
  // (es. ?categoria=farmacia e ?categoria=hotel già generano click reali).
  // Escluse solo le categorie ancora senza locali verificati (supermercato).
  const populatedDirectoryCategories = new Set(BUSINESSES.map((b) => b.category));
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES
    .filter((c) => populatedDirectoryCategories.has(c.slug))
    .map((c) => entry(`/directory?categoria=${c.slug}`, { changeFrequency: "weekly", priority: 0.6 }));

  // Pagine città con almeno 2 locali verificati: hanno titolo, descrizione e
  // canonical propri (vedi lib/directory-seo.ts). Le città con un solo locale
  // restano raggiungibili dai link interni ma non vengono spinte in sitemap.
  const cityCounts = new Map<string, number>();
  for (const b of BUSINESSES) cityCounts.set(b.city, (cityCounts.get(b.city) ?? 0) + 1);
  const cityPages: MetadataRoute.Sitemap = [...cityCounts]
    .filter(([, n]) => n >= 2)
    .map(([city]) => entry(`/directory?comune=${encodeURIComponent(city)}`, { changeFrequency: "weekly", priority: 0.6 }));

  const productCategoryPages: MetadataRoute.Sitemap = PRODUCT_CATEGORIES.map((c) =>
    entry(`/prodotti?categoria=${encodeURIComponent(c)}`, { changeFrequency: "weekly", priority: 0.5 }),
  );

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) =>
    entry(`/prodotti/${p.slug}`, { changeFrequency: "monthly", priority: 0.6 }),
  );

  const businessPages: MetadataRoute.Sitemap = BUSINESSES.map((b) =>
    entry(`/directory/${b.slug}`, { changeFrequency: "weekly", priority: 0.7, lastModified: b.createdAt }),
  );

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) =>
    entry(`/blog/${a.slug}`, { changeFrequency: "monthly", priority: 0.6, lastModified: a.updatedAt }),
  );

  return [...staticPages, ...categoryPages, ...cityPages, ...productCategoryPages, ...productPages, ...businessPages, ...articlePages];
}
