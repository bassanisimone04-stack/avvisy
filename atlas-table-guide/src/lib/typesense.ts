import type { SearchDoc } from "./search";

export const typesenseConfigured = () => Boolean(process.env.TYPESENSE_HOST && process.env.TYPESENSE_API_KEY);
const base = () => { const h = process.env.TYPESENSE_HOST!; const proto = process.env.TYPESENSE_PROTOCOL ?? (h.startsWith("localhost") || h.startsWith("127.") ? "http" : "https"); return `${proto}://${h}${process.env.TYPESENSE_PORT ? `:${process.env.TYPESENSE_PORT}` : ""}`; };
export const collectionName = (locale: string) => `atlas_${locale}`;

export const collectionSchema = (locale: string) => ({
  name: collectionName(locale),
  fields: [
    { name: "type", type: "string", facet: true }, { name: "title", type: "string" }, { name: "subtitle", type: "string" },
    { name: "href", type: "string", index: false, optional: true }, { name: "text", type: "string" }, { name: "boost", type: "float" },
  ],
  default_sorting_field: "boost",
});

export const toTypesenseDoc = (d: SearchDoc) => ({ id: `${d.type}:${d.id}`, type: d.type, title: d.title, subtitle: d.subtitle, href: d.href, text: d.text, boost: d.boost ?? 0 });

export function searchParams(q: string, limit: number) {
  return new URLSearchParams({ q, query_by: "title,subtitle,text", query_by_weights: "6,2,1", num_typos: "2", prefix: "true", per_page: String(limit), sort_by: "_text_match:desc,boost:desc" });
}

type Hit = { type: string; id: string; title: string; subtitle: string; href: string };

/** Typo-tolerant hosted search. Returns null when not configured or on any failure so callers fall back. */
export async function typesenseSearch(q: string, locale: string, limit: number): Promise<Hit[] | null> {
  if (!typesenseConfigured() || !q.trim()) return null;
  try {
    const res = await fetch(`${base()}/collections/${collectionName(locale)}/documents/search?${searchParams(q, limit)}`, { headers: { "X-TYPESENSE-API-KEY": process.env.TYPESENSE_API_KEY! }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const j = (await res.json()) as { hits?: { document: { id: string; type: string; title: string; subtitle: string; href: string } }[] };
    return (j.hits ?? []).map(({ document: d }) => ({ type: d.type, id: d.id.split(":").slice(1).join(":"), title: d.title, subtitle: d.subtitle, href: d.href }));
  } catch { return null; }
}

/** Used by scripts/typesense-sync.ts */
export async function syncCollection(locale: string, docs: SearchDoc[]) {
  const h = { "X-TYPESENSE-API-KEY": process.env.TYPESENSE_API_KEY!, "Content-Type": "application/json" };
  await fetch(`${base()}/collections/${collectionName(locale)}`, { method: "DELETE", headers: h }).catch(() => undefined);
  const c = await fetch(`${base()}/collections`, { method: "POST", headers: h, body: JSON.stringify(collectionSchema(locale)) });
  if (!c.ok) throw new Error(`create collection: ${c.status} ${await c.text()}`);
  const r = await fetch(`${base()}/collections/${collectionName(locale)}/documents/import?action=upsert`, { method: "POST", headers: h, body: docs.map((d) => JSON.stringify(toTypesenseDoc(d))).join("\n") });
  const lines = (await r.text()).split("\n").filter(Boolean).map((l) => JSON.parse(l) as { success: boolean });
  const failed = lines.filter((l) => !l.success).length;
  if (!r.ok || failed) throw new Error(`import: ${failed} failed of ${lines.length}`);
  return lines.length;
}
