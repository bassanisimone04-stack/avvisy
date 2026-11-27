/** URL slug from any human string: lowercase ASCII, diacritics stripped, hyphen-separated. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[œŒ]/g, "oe")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Slug that does not collide with `taken`; appends -2, -3… (or the city when given). */
export function uniqueSlug(input: string, taken: Iterable<string>, qualifier?: string): string {
  const set = new Set(taken);
  const base = slugify(input) || "item";
  if (!set.has(base)) return base;
  if (qualifier) {
    const q = `${base}-${slugify(qualifier)}`;
    if (!set.has(q)) return q;
  }
  for (let i = 2; ; i++) {
    const s = `${base}-${i}`;
    if (!set.has(s)) return s;
  }
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isSlug = (s: string) => SLUG_RE.test(s) && s.length <= 80;
