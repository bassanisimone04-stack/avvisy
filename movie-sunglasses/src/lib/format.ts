export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}
export function formatDate(iso: string) {
  const d = new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
export const decadeOf = (year: number) => `${Math.floor(year / 10) * 10}s`;
export const truncate = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");
export const jsonLd = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

/**
 * Parses "1,300", "1.300", "1.149,50", "$1,149.50", "12,5" and "12.5" into numbers; returns null when it is not a number.
 * A lone "." or "," followed by exactly three digits (and a group before it) is a thousands separator; otherwise it is decimal.
 */
export function parseNumber(input: string | undefined): number | null {
  let s = (input ?? "").replace(/[^0-9.,-]/g, "");
  if (!/\d/.test(s)) return null;
  const neg = s.startsWith("-");
  s = s.replace(/-/g, "");
  const dot = s.lastIndexOf("."), comma = s.lastIndexOf(",");
  if (dot >= 0 && comma >= 0) s = dot > comma ? s.replace(/,/g, "") : s.replace(/\./g, "").replace(",", ".");
  else if (comma >= 0) s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  else if (dot >= 0 && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return Number.isFinite(n) ? (neg ? -n : n) : null;
}
