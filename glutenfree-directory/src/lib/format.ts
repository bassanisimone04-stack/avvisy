export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDateIt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDate(iso: string, locale: "it" | "en" = "it"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" });
}

export function formatPrice(n: number, locale: "it" | "en" = "it"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "it-IT", { style: "currency", currency: "EUR" }).format(n);
}

export function readingTimeFromWords(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

export function clampRating(n: number): number {
  return Math.round(n * 10) / 10;
}
