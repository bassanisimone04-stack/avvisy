import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { listProducts } from "@/features/catalog/repository";
import { listBusinesses } from "@/features/directory/repository";
import { tools } from "@/features/tools/registry";

/**
 * Only indexable URLs belong here. Demo listings and demo products are
 * excluded by design (docs/SEO_STRATEGY.md → indexing rules).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ["/", "/tools", ...tools.map((t) => `/tools/${t.slug}`)];
  urls.push(...listBusinesses().filter((b) => !b.isDemo).map((b) => `/business/${b.slug}`));
  urls.push(...listProducts().filter((p) => !p.isDemo).map((p) => `/shop/${p.slug}`));
  return urls.map((u) => ({ url: absoluteUrl(u) }));
}
