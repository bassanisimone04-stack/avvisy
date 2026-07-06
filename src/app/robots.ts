import type { MetadataRoute } from "next";

const SITE_URL = "https://avvisy.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/registrati", "/onboarding", "/checkin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
