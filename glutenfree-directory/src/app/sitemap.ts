import type { MetadataRoute } from "next";
import { BUSINESSES } from "@/lib/mock-businesses";
import { ARTICLES } from "@/lib/mock-articles";
import { PRODUCTS } from "@/lib/mock-products";
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
    entry("/blog", { changeFrequency: "daily", priority: 0.8 }),
    entry("/prodotti", { changeFrequency: "weekly", priority: 0.7 }),
    entry("/chi-siamo", { changeFrequency: "monthly", priority: 0.3 }),
    entry("/contatti", { changeFrequency: "monthly", priority: 0.3 }),
    entry("/per-le-aziende", { changeFrequency: "monthly", priority: 0.4 }),
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) =>
    entry(`/directory?categoria=${c.slug}`, { changeFrequency: "weekly", priority: 0.6 }),
  );

  const businessPages: MetadataRoute.Sitemap = BUSINESSES.map((b) =>
    entry(`/directory/${b.slug}`, { changeFrequency: "weekly", priority: 0.7, lastModified: b.createdAt }),
  );

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) =>
    entry(`/blog/${a.slug}`, { changeFrequency: "monthly", priority: 0.6, lastModified: a.updatedAt }),
  );

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) =>
    entry(`/prodotti/${p.slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  );

  return [...staticPages, ...categoryPages, ...businessPages, ...articlePages, ...productPages];
}
