import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

/** Blocks everything unless indexing is explicitly enabled for production. */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/favorites", "/sign-in", "/search", "/api/", "/admin/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
