import { normalize } from "./format";
import { parseCsv } from "./keywords";
import { validatePhoto } from "./photos";
import type { Article, Movie, Photo, SunglassesModel } from "./types";

export interface PhotoImportResult { photos: Photo[]; errors: { line: number; message: string }[]; rows: number }

const HEAD = {
  url: ["url", "image url", "image"], alt: ["alt", "alt text", "description"], kind: ["kind", "type"], credit: ["credit", "author"],
  license: ["license", "licence", "rights"], licenseUrl: ["license url", "license_url", "proof", "rights url"], sourceUrl: ["source url", "source_url", "source", "origin"],
  rightsNote: ["rights note", "rights_note", "rationale", "fair use rationale"], model: ["model"], movie: ["movie", "film"], article: ["article", "guide"], approved: ["approved", "publish", "live"],
};
const YES = new Set(["yes", "true", "1", "y", "si", "sì", "x"]);

/** Bulk-registers photo records. Same rules as the admin form; all-or-nothing; nothing is published unless approved=yes AND the rights rules pass. */
export function photosFromCsv(text: string, models: SunglassesModel[], movies: Movie[], articles: Article[], opts: { ownHost?: string } = {}): PhotoImportResult {
  const rows = parseCsv(text);
  const errors: { line: number; message: string }[] = [];
  if (rows.length < 2) return { photos: [], errors: [{ line: 1, message: "Servono una riga di intestazione e almeno una riga di dati." }], rows: 0 };
  const head = rows[0].map(normalize);
  const col = (names: string[]) => head.findIndex((h) => names.map(normalize).includes(h));
  const idx = Object.fromEntries(Object.entries(HEAD).map(([k, v]) => [k, col(v)])) as Record<keyof typeof HEAD, number>;
  for (const need of ["url", "alt", "credit", "license"] as const) if (idx[need] < 0) errors.push({ line: 1, message: `Colonna obbligatoria mancante: ${need}.` });
  if (errors.length) return { photos: [], errors, rows: rows.length - 1 };
  const index = <T extends { id: string; slug?: string; name?: string; title?: string }>(list: T[]) => { const m = new Map<string, T>(); for (const x of list) { m.set(normalize(x.id), x); if (x.slug) m.set(normalize(x.slug), x); const n = x.name ?? x.title; if (n) m.set(normalize(n), x); } return m; };
  const M = index(models), V = index(movies), A = index(articles);
  const out = new Map<string, Photo>();
  rows.slice(1).forEach((r, i) => {
    const line = i + 2, cell = (k: keyof typeof HEAD) => (idx[k] >= 0 ? (r[idx[k]] ?? "").trim() : "");
    const fail = (message: string) => errors.push({ line, message });
    const look = <T,>(map: Map<string, T>, k: keyof typeof HEAD, what: string): T | undefined | "bad" => { const v = cell(k); if (!v) return undefined; const hit = map.get(normalize(v)); if (!hit) { fail(`${what} sconosciuto: «${v}».`); return "bad"; } return hit; };
    const model = look(M, "model", "Modello"), movie = look(V, "movie", "Film"), article = look(A, "article", "Articolo");
    if (model === "bad" || movie === "bad" || article === "bad") return;
    const kind = (cell("kind") || "scene").toLowerCase();
    if (kind !== "product" && kind !== "scene") return fail("Il tipo deve essere «product» o «scene».");
    const photo: Photo = {
      id: `ph_${normalize(cell("url")).slice(-40).replace(/ /g, "")}`, url: cell("url"), alt: cell("alt"), credit: cell("credit"), license: cell("license").toLowerCase().replace(/[ -]/g, "_"),
      licenseUrl: cell("licenseUrl") || undefined, sourceUrl: cell("sourceUrl") || undefined, rightsNote: cell("rightsNote") || undefined, kind,
      modelId: model?.id, movieId: movie?.id, articleId: article?.id, approved: YES.has(cell("approved").toLowerCase()),
    };
    const err = validatePhoto(photo, opts);
    if (err) return fail(err);
    out.set(photo.id, photo);
  });
  return { photos: [...out.values()], errors, rows: rows.length - 1 };
}
