/** Operational configuration. All thresholds are configurable via env. */
const num = (v: string | undefined, d: number) => (v && !Number.isNaN(Number(v)) ? Number(v) : d);

export const SITE = {
  /** Show rows flagged is_demo. Set ALLOW_DEMO_DATA=false in production to hide them. */
  allowDemoData: (process.env.ALLOW_DEMO_DATA ?? "true") !== "false",
  /** Min verified sample size before the Price Index shows a figure. */
  priceIndexMinSample: num(process.env.PRICE_INDEX_MIN_SAMPLE, 5),
  /** Min verified restaurants before a destination hub is indexable. */
  destinationMinVerified: num(process.env.DESTINATION_MIN_VERIFIED, 5),
  /** Min verified results for a whitelisted facet combination (e.g. city + cuisine) to be indexable. */
  facetMinResults: num(process.env.FACET_MIN_RESULTS, 3),
  /** A verified record becomes "stale" after N days. */
  staleAfterDays: num(process.env.STALE_AFTER_DAYS, 180),
  /** Min first-party reviews before aggregateRating may be emitted. */
  minReviewsForRating: num(process.env.MIN_REVIEWS_FOR_RATING, 10),
  pageSize: 12,
  compareMax: 4,
  /** "allow-all" | "search-only" | "block-all" — see src/app/robots.ts */
  aiCrawlersPolicy: (process.env.AI_CRAWLERS_POLICY ?? "search-only") as "allow-all" | "search-only" | "block-all",
  mapStyleUrl: process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/liberty",
  currencies: ["EUR", "USD", "GBP", "JPY", "CHF", "AED", "SGD", "CAD", "AUD"] as const,
} as const;

export type CurrencyCode = (typeof SITE.currencies)[number];

/** Integration status — computed server-side only, never exposes values. */
export function integrations() {
  return {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseService: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")),
    resend: Boolean(process.env.RESEND_API_KEY),
    llm: Boolean(process.env.LLM_API_KEY),
    fx: (process.env.FX_PROVIDER ?? "frankfurter") !== "none",
    typesense: Boolean(process.env.TYPESENSE_HOST && process.env.TYPESENSE_API_KEY),
    analytics: Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
    adminDevToken: Boolean(process.env.ADMIN_DEV_TOKEN) && process.env.NODE_ENV !== "production",
  };
}
