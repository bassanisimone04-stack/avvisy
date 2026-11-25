/**
 * Global site configuration.
 *
 * The brand name and domain are NOT decided yet. Everything brand-related is
 * read from here (and from env vars) so the final name can be swapped in one
 * place. See docs/PROJECT_CONTEXT.md.
 */
export const siteConfig = {
  /** Placeholder brand name — replace when the brand is chosen. */
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "YourBrand",
  tagline: "Made for makers.",
  description:
    "Discover local workshops, trusted suppliers and digital projects to bring your ideas to life.",
  /** Canonical origin. Domain to be decided; localhost during development. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Public contact address placeholder (no mailbox exists yet). */
  contactEmail: "hello@example.com",
  defaultLocale: "en-US",
  defaultCurrency: "USD",
  /**
   * Indexing is OFF unless explicitly enabled for production. Demo data,
   * previews and local builds must never be indexed (docs/SEO_STRATEGY.md).
   */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** True while the site runs on demo data only (Phase 1). */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
