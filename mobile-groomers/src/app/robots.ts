import type { MetadataRoute } from "next";
import { SITE_DOMAIN, SITE_URL } from "@/lib/site-config";

/**
 * Preview and staging deploys must not be indexed. A crawlable copy of the
 * whole directory on another host competes with production for the same
 * queries and splits its ranking signals, which is worse than not deploying
 * a preview at all.
 */
const isProduction = SITE_URL === `https://${SITE_DOMAIN}`;

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private surfaces, and pages with no standalone search value.
        disallow: ["/api/", "/dashboard", "/login", "/auth/", "/unsubscribe", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
