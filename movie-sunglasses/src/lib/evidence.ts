import type { Evidence, MatchType, MovieAppearance } from "./types";

const domain = (u: string) => {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; }
};
const TRUSTED = new Set(["primary", "brand", "press", "reference"]);
export const MATCH_ORDER: MatchType[] = ["exact", "official_reissue", "similar", "unconfirmed"];

export interface EffectiveMatch { type: MatchType; declared: MatchType; downgraded: boolean; reason: string; sources: number }

/**
 * Labels must follow evidence, not assumptions.
 * Exact / Official Reissue are kept only when
 *  - no source disputes the identification, AND
 *  - at least one primary/brand/press/reference source supports it, or two independent domains do.
 * Otherwise the label is shown as Unconfirmed.
 */
export function effectiveMatch(app: Pick<MovieAppearance, "matchType">, ev: Evidence[]): EffectiveMatch {
  const declared = app.matchType;
  const supports = ev.filter((e) => e.stance !== "disputes");
  const disputes = ev.filter((e) => e.stance === "disputes");
  const base = { declared, sources: supports.length };
  if (declared !== "exact" && declared !== "official_reissue") return { ...base, type: declared, downgraded: false, reason: "" };
  if (disputes.length) return { ...base, type: "unconfirmed", downgraded: true, reason: "At least one source disputes this identification." };
  const domains = new Set(supports.map((e) => domain(e.sourceUrl)));
  if (supports.some((e) => TRUSTED.has(e.sourceType)) || domains.size >= 2) return { ...base, type: declared, downgraded: false, reason: "" };
  return { ...base, type: "unconfirmed", downgraded: true, reason: supports.length === 0 ? "No supporting source recorded." : "Only one non-authoritative source supports this." };
}

export function bestMatch(types: MatchType[]): MatchType {
  return MATCH_ORDER.find((t) => types.includes(t)) ?? "unconfirmed";
}
