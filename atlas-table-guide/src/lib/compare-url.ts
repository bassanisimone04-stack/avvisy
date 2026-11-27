import { isSlug } from "./slug";

export const COMPARE_MAX = 4;

/** Deduplicated, validated, max-4 list of slugs → "a,b,c". */
export function encodeCompare(slugs: readonly string[]): string {
  return normalise(slugs).join(",");
}

export function decodeCompare(param: string | string[] | undefined | null): string[] {
  if (!param) return [];
  const raw = (Array.isArray(param) ? param.join(",") : param).split(",");
  return normalise(raw.map((s) => decodeURIComponent(s).trim().toLowerCase()));
}

function normalise(slugs: readonly string[]): string[] {
  const out: string[] = [];
  for (const s of slugs) {
    if (isSlug(s) && !out.includes(s)) out.push(s);
    if (out.length === COMPARE_MAX) break;
  }
  return out;
}

export function compareHref(locale: string, slugs: readonly string[]) {
  const enc = encodeCompare(slugs);
  return `/${locale}/compare/${enc ? `?r=${enc}` : ""}`;
}
