import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { STYLES, SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getCatalog();
  const u = (p: string) => SITE.url + p;
  const latest = (d: string) => new Date(d.length === 10 ? d + "T12:00:00Z" : d);
  const statics = ["/", "/movies", "/actors", "/sunglasses", "/brands", "/styles", "/affordable-alternatives", "/vintage", "/blog", "/about", "/contact", "/privacy-policy", "/cookie-policy", "/terms", "/affiliate-disclosure"];
  return [
    ...statics.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...c.movies.map((m) => ({ url: u(`/movies/${m.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...c.actors.filter((a) => c.modelsForActor(a.id).length).map((a) => ({ url: u(`/actors/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...c.brands.filter((b) => c.modelsForBrand(b.id).length >= 2).map((b) => ({ url: u(`/brands/${b.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...STYLES.filter((s) => c.modelsForStyle(s.slug).length).map((s) => ({ url: u(`/styles/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...c.models.map((m) => ({ url: u(`/sunglasses/${m.slug}`), lastModified: m.verifiedAt ? latest(m.verifiedAt) : undefined, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...c.articles.map((a) => ({ url: u(`/blog/${a.slug}`), lastModified: latest(a.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
