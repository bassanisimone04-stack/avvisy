export const COMPARE_MAX = 4;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Parses `?r=a,b,c` → unique valid slugs, max 4 (original behaviour: first four win). */
export function parseCompare(param: string | null | undefined): string[] {
  if (!param) return [];
  const out: string[] = [];
  for (const raw of param.split(",")) {
    const s = raw.trim().toLowerCase();
    if (SLUG.test(s) && !out.includes(s)) out.push(s);
    if (out.length === COMPARE_MAX) break;
  }
  return out;
}

export const compareHref = (locale: string, slugs: readonly string[]) => `/${locale}/compare/?${new URLSearchParams({ r: slugs.join(",") })}`;
