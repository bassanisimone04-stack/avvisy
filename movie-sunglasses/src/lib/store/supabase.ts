import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CollectionName, Collections } from "../types";

export const TABLES: Record<CollectionName, string> = {
  movies: "movies", actors: "actors", characters: "characters", brands: "brands",
  models: "sunglasses_models", appearances: "movie_appearances", evidence: "identification_evidence",
  alternatives: "product_alternatives", merchants: "merchants", offers: "affiliate_offers",
  articles: "articles", keywords: "keywords", clicks: "click_events", views: "view_counts",
  revenue: "revenue_entries", redirects: "redirects", messages: "contact_messages", photos: "photos",
};
const NULLABLE = new Set(["publishAt", "verifiedAt", "price"]);
const snake = (s: string) => s.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  }
  return client;
}
const toRow = (o: object) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => [snake(k), v]));
const fromRow = (r: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(r).map(([k, v]) => [camel(k), v]).filter(([k, v]) => v !== null || NULLABLE.has(k as string)));

export async function sbList<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  const out: Collections[K][] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from(TABLES[name]).select("*").range(from, from + 999);
    if (error) throw new Error(`Supabase ${TABLES[name]}: ${error.message}`);
    out.push(...(data ?? []).map((r) => fromRow(r) as Collections[K]));
    if (!data || data.length < 1000) break;
  }
  return out;
}
export async function sbUpsert<K extends CollectionName>(name: K, row: Collections[K]): Promise<void> {
  const { error } = await db().from(TABLES[name]).upsert(toRow(row as object));
  if (error) throw new Error(`Supabase ${TABLES[name]}: ${error.message}`);
}
export async function sbRemove(name: CollectionName, id: string): Promise<void> {
  const { error } = await db().from(TABLES[name]).delete().eq("id", id);
  if (error) throw new Error(`Supabase ${TABLES[name]}: ${error.message}`);
}
