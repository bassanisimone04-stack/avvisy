/**
 * BRAND — single source of truth.
 * Every visible brand string (logo text, titles, JSON-LD Organization, sitemaps, llms.txt,
 * emails, legal pages, OG images) reads from here. Rebrand = edit this file only.
 */
export const BRAND = {
  name: "ATLAS TABLE GUIDE", // PLACEHOLDER – owner will replace
  shortName: "Atlas Table",
  domain: "example-guide.com", // PLACEHOLDER – owner will replace
  tagline: "Every great table, mapped.",
  legalEntity: "TO BE COMPLETED",
  supportEmail: "hello@example-guide.com",
  selectionName: "Atlas Selection",
  defaultLocale: "en",
  locales: ["en", "it"],
  defaultCurrency: "EUR",
} as const;

export type Locale = (typeof BRAND.locales)[number];

/** Absolute site origin. NEXT_PUBLIC_SITE_URL wins (e.g. preview deployments). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${BRAND.domain}`).replace(/\/$/, "");

export function disclaimer(): string {
  return `${BRAND.shortName} is an independent platform and is not affiliated with, endorsed by or sponsored by any restaurant guide or award body mentioned on this site. All trademarks belong to their respective owners.`;
}
