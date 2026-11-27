import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/brand";
import { SITE } from "@/config/site";

/** AI answer/search crawlers vs. model-training crawlers, switchable via AI_CRAWLERS_POLICY. */
const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "DuckAssistBot"];
const AI_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent", "Bytespider"];
const DISALLOW = ["/admin/", "/account/", "/*/account/", "/api/", "/go/", "/*/compare/", "/*/design-system/", "/*?*sort=", "/*?*view=", "/*?*page=", "/*?*near=", "/*?*bbox=", "/*?*q="];

export default function robots(): MetadataRoute.Robots {
  const policy = SITE.aiCrawlersPolicy;
  const rules: MetadataRoute.Robots["rules"] = [{ userAgent: "*", allow: "/", disallow: DISALLOW }];
  if (policy === "allow-all" || policy === "search-only") rules.push({ userAgent: AI_SEARCH, allow: "/", disallow: DISALLOW });
  else rules.push({ userAgent: AI_SEARCH, disallow: "/" });
  if (policy === "allow-all") rules.push({ userAgent: AI_TRAINING, allow: "/", disallow: DISALLOW });
  else if (policy === "search-only") rules.push({ userAgent: AI_TRAINING.filter((u) => u !== "Google-Extended" && u !== "ClaudeBot"), disallow: "/" }, { userAgent: ["Google-Extended", "ClaudeBot"], allow: "/", disallow: DISALLOW });
  else rules.push({ userAgent: AI_TRAINING, disallow: "/" });
  return { rules, sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
