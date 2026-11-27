import { SITE } from "@/config/site";

/**
 * Indexation policy for directory URLs (see docs/SEO.md):
 *  - Hub without query parameters → indexable when it passes the quality gate.
 *  - Whitelisted facet: city hub + exactly one `cuisine` value and nothing else → indexable, self-canonical,
 *    when it has ≥ FACET_MIN_RESULTS verified results.
 *  - Everything else (other filters, sort, view, page, near, bbox, q) → noindex,follow, canonical to the parent hub,
 *    excluded from sitemaps.
 */
export type HubKind = "global" | "country" | "region" | "city";

export type IndexDecision = { index: boolean; canonicalPath: string; reason: string };

const IGNORABLE = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);

export function facetIndexability(input: {
  hubPath: string; // e.g. /en/restaurants/france/paris/
  kind: HubKind;
  params: Record<string, string | undefined>;
  hubPassesQualityGate: boolean;
  facetVerifiedCount?: number; // verified results for the whitelisted facet combination
}): IndexDecision {
  const keys = Object.keys(input.params).filter((k) => input.params[k] !== undefined && input.params[k] !== "" && !IGNORABLE.has(k));
  if (keys.length === 0) {
    return input.hubPassesQualityGate
      ? { index: true, canonicalPath: input.hubPath, reason: "hub" }
      : { index: false, canonicalPath: input.hubPath, reason: "hub below quality gate" };
  }
  if (input.kind === "city" && keys.length === 1 && keys[0] === "cuisine") {
    const c = input.params.cuisine!;
    if (/^[a-z0-9-]+$/.test(c) && !c.includes(",") && (input.facetVerifiedCount ?? 0) >= SITE.facetMinResults) {
      return { index: true, canonicalPath: `${input.hubPath}?cuisine=${c}`, reason: "whitelisted city+cuisine" };
    }
  }
  return { index: false, canonicalPath: input.hubPath, reason: "parameterised facet/sort/pagination" };
}

/** Quality gate for destination hubs: ≥ N verified, published restaurants AND an original intro. */
export function passesQualityGate(verifiedCount: number, hasOriginalIntro: boolean): boolean {
  return verifiedCount >= SITE.destinationMinVerified && hasOriginalIntro;
}
