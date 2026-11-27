import { z } from "zod";
import { haversine } from "./geo";
import { parsePrice } from "./price";
import { levenshtein, normalize, trigramSimilarity } from "./search";
import { slugify } from "./slug";

/** RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF, embedded newlines). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let q = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (q) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

export const IMPORT_COLUMNS = ["name", "city", "country", "lat", "lng", "cuisine", "website", "lunch_price", "dinner_price", "wine_price", "currency", "source_url"] as const;

const priceField = z.string().optional().transform((v, ctx) => {
  if (!v?.trim()) return null;
  const p = parsePrice(v);
  if (!p) { ctx.addIssue({ code: "custom", message: `unreadable price "${v}"` }); return z.NEVER; }
  return p.amount;
});

export const ImportRow = z.object({
  name: z.string().trim().min(2, "name is required").max(120),
  city: z.string().trim().min(2, "city is required"),
  country: z.string().trim().min(2, "country is required"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  cuisine: z.string().trim().optional().default(""),
  website: z.string().trim().url("website must be a URL").optional().or(z.literal("")).default(""),
  lunch_price: priceField,
  dinner_price: priceField,
  wine_price: priceField,
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "currency must be an ISO 4217 code").default("EUR"),
  source_url: z.string().trim().url("source_url is required for every imported record"),
});
export type ImportRow = z.infer<typeof ImportRow>;

export type ExistingVenue = { id: string; slug: string; name: string; lat: number; lng: number; website?: string };

export type DuplicateMatch = { line: number; name: string; match: string; matchSource: "database" | "file"; nameSimilarity: number; distanceM: number; reason: string };

export type ImportReport = {
  total: number;
  valid: number;
  invalid: { line: number; errors: string[] }[];
  duplicates: DuplicateMatch[];
  possibleDuplicates: DuplicateMatch[];
  toInsert: (ImportRow & { slug: string; line: number })[];
  missingColumns: string[];
};

const host = (u?: string) => {
  try { return u ? new URL(u).hostname.replace(/^www\./, "") : ""; } catch { return ""; }
};

/** Name similarity 0..1 combining trigram Jaccard and normalised Levenshtein. */
export function nameSimilarity(a: string, b: string): number {
  const x = normalize(a).replace(/\b(restaurant|ristorante|the|le|la|il)\b/g, "").replace(/\s+/g, " ").trim();
  const y = normalize(b).replace(/\b(restaurant|ristorante|the|le|la|il)\b/g, "").replace(/\s+/g, " ").trim();
  if (!x || !y) return 0;
  const lev = 1 - levenshtein(x, y) / Math.max(x.length, y.length);
  return Math.max(trigramSimilarity(x, y), lev);
}

/** Classify a candidate pair. Thresholds documented in docs/DATA.md. */
export function classifyPair(a: { name: string; lat: number; lng: number; website?: string }, b: { name: string; lat: number; lng: number; website?: string }) {
  const sim = nameSimilarity(a.name, b.name);
  const dist = haversine(a, b);
  const sameHost = host(a.website) && host(a.website) === host(b.website);
  if (sameHost) return { level: "duplicate" as const, sim, dist, reason: "same website domain" };
  if (sim >= 0.6 && dist <= 150) return { level: "duplicate" as const, sim, dist, reason: "similar name within 150 m" };
  if (sim >= 0.9 && dist <= 2000) return { level: "duplicate" as const, sim, dist, reason: "near-identical name within 2 km" };
  if (sim >= 0.75 && dist <= 1000) return { level: "possible" as const, sim, dist, reason: "similar name within 1 km" };
  if (dist <= 25) return { level: "possible" as const, sim, dist, reason: "same coordinates" };
  return { level: "none" as const, sim, dist, reason: "" };
}

/** Dry-run: validate, detect duplicates against existing data and within the file. Never writes. */
export function dryRunImport(csv: string, existing: ExistingVenue[]): ImportReport {
  const rows = parseCsv(csv);
  const header = (rows.shift() ?? []).map((h) => h.trim().toLowerCase());
  const required = IMPORT_COLUMNS.filter((c) => !["cuisine", "website", "lunch_price", "dinner_price", "wine_price", "currency"].includes(c));
  const missingColumns = required.filter((c) => !header.includes(c));
  const report: ImportReport = { total: rows.length, valid: 0, invalid: [], duplicates: [], possibleDuplicates: [], toInsert: [], missingColumns };
  if (missingColumns.length) return report;
  const taken = new Set(existing.map((e) => e.slug));
  const accepted: (ImportRow & { line: number })[] = [];
  rows.forEach((cells, i) => {
    const line = i + 2;
    const obj = Object.fromEntries(header.map((h, k) => [h, cells[k] ?? ""]));
    const parsed = ImportRow.safeParse(obj);
    if (!parsed.success) {
      report.invalid.push({ line, errors: parsed.error.issues.map((e) => `${e.path.join(".") || "row"}: ${e.message}`) });
      return;
    }
    report.valid++;
    const row = parsed.data;
    let dup = false;
    const check = (other: { name: string; lat: number; lng: number; website?: string }, source: "database" | "file") => {
      const c = classifyPair(row, other);
      if (c.level === "none") return;
      const m: DuplicateMatch = { line, name: row.name, match: other.name, matchSource: source, nameSimilarity: +c.sim.toFixed(2), distanceM: Math.round(c.dist), reason: c.reason };
      if (c.level === "duplicate") { report.duplicates.push(m); dup = true; } else report.possibleDuplicates.push(m);
    };
    for (const e of existing) { check(e, "database"); if (dup) break; }
    if (!dup) for (const a of accepted) { check(a, "file"); if (dup) break; }
    if (dup) return;
    accepted.push({ ...row, line });
    let slug = slugify(`${row.name}-${row.city}`);
    for (let n = 2; taken.has(slug); n++) slug = `${slugify(`${row.name}-${row.city}`)}-${n}`;
    taken.add(slug);
    report.toInsert.push({ ...row, slug, line });
  });
  return report;
}
