import type { Restaurant } from "@/db/types";

/** Content completeness score (0–100) shown in admin; drives the "thin content" warning. */
export function completeness(r: Restaurant): { score: number; missing: string[] } {
  const checks: [string, boolean][] = [
    ["description ≥ 80 chars", r.description.en.length >= 80],
    ["Italian translation", !!r.description.it],
    ["cuisine", r.cuisines.length > 0],
    ["chef", !!r.chefSlug],
    ["≥ 5 images", r.images.length >= 5],
    ["licensed (non-illustrative) photo", r.images.some((i) => !i.illustrative)],
    ["opening hours", r.hours.length > 0],
    ["verified tasting price", r.menus.some((m) => m.kind === "tasting" && m.status === "verified")],
    ["wine pairing price", r.menus.some((m) => m.kind === "wine_pairing" && m.amount != null)],
    ["dietary info", r.dietary.vegetarian || r.dietary.vegan || r.dietary.glutenFree],
    ["reservation info", !!r.reservation.instructions.en],
    ["contact (phone or email)", !!(r.phone || r.email)],
    ["website", !!r.website],
    ["source URL", !!r.sourceUrl],
    ["verified", r.verificationStatus === "verified"],
  ];
  const missing = checks.filter(([, ok]) => !ok).map(([k]) => k);
  return { score: Math.round(((checks.length - missing.length) / checks.length) * 100), missing };
}
