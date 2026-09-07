import type { MetadataRoute } from "next";
import { getAllGroomers } from "@/lib/groomers";
import { FEATURED_CITIES, SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = ["", "/cities", "/pricing", "/claim", "/faq", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const cityPages = FEATURED_CITIES.map((c) => ({
    url: `${SITE_URL}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const groomerPages = (await getAllGroomers()).map((g) => ({
    url: `${SITE_URL}/groomers/${g.citySlug}/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...groomerPages];
}
