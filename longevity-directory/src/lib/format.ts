export function euro(n: number): string {
  return n.toLocaleString("it-IT") + " €";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Slugify semplice per città/testi liberi, coerente con lib/taxonomy.ts#citySlug. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
