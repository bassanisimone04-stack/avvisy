import type { MetadataRoute } from "next";
import { organizations } from "@/lib/mock-data";

const SITE_URL = "https://avvisy.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/prezzi",
    "/assistente",
    "/aiuto",
    "/privacy",
    "/termini",
    "/login",
    "/registrati",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const orgPages = organizations.flatMap((o) => [
    { url: `${SITE_URL}/s/${o.slug}`, lastModified: new Date() },
    { url: `${SITE_URL}/s/${o.slug}/book`, lastModified: new Date() },
  ]);

  return [...staticPages, ...orgPages];
}
