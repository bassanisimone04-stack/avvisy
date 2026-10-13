import type { MetadataRoute } from "next";
import { getAllGroomers } from "@/lib/groomers";
import { POSTS } from "@/data/posts";
import { FEATURED_CITIES, SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // The blog hub is only as fresh as its newest post.
  const newestPost = POSTS.reduce(
    (latest, p) => (p.updated > latest ? p.updated : latest),
    POSTS[0]?.updated ?? "",
  );

  const staticPages = ["", "/cities", "/pricing", "/claim", "/faq", "/blog", "/about", "/for-groomers"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "/blog" && newestPost ? new Date(newestPost) : now,
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

  const postPages = POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    // Last review date, not first publication — the signal crawlers use.
    lastModified: new Date(p.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...groomerPages, ...postPages];
}
