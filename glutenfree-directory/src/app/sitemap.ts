import type { MetadataRoute } from "next";
import { BUSINESSES } from "@/lib/mock-businesses";
import { ARTICLES } from "@/lib/mock-articles";
import { PRODUCTS } from "@/lib/mock-products";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/directory`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/prodotti`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/chi-siamo`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contatti`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/per-le-aziende`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/directory?categoria=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const businessPages: MetadataRoute.Sitemap = BUSINESSES.map((b) => ({
    url: `${SITE_URL}/directory/${b.slug}`,
    lastModified: b.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/prodotti/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...businessPages, ...articlePages, ...productPages];
}
