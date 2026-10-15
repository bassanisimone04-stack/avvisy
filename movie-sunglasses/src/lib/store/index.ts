import type { CollectionName, Collections } from "../types";
import { fileList, fileVersion, fileWrite } from "./file";
import { sbList, sbRemove, sbUpsert } from "./supabase";

export const usingSupabase = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
export const storageMode = () => (usingSupabase() ? "supabase" : "file");

const TTL = 15_000;
let epoch = 0; // bumps on every write in this instance so derived caches (catalog) rebuild immediately
export const storeVersion = () => `${epoch}:${usingSupabase() ? Math.floor(Date.now() / TTL) : fileVersion()}`;
const memo = new Map<CollectionName, { at: number; rows: unknown[] }>();

export async function listAll<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  if (!usingSupabase()) return fileList(name);
  const hit = memo.get(name);
  if (hit && Date.now() - hit.at < TTL) return hit.rows as Collections[K][];
  const rows = await sbList(name);
  memo.set(name, { at: Date.now(), rows });
  return rows;
}

export async function getById<K extends CollectionName>(name: K, id: string): Promise<Collections[K] | undefined> {
  return (await listAll(name)).find((r) => (r as { id: string }).id === id);
}

export async function upsert<K extends CollectionName>(name: K, row: Collections[K]): Promise<void> {
  if (usingSupabase()) {
    await sbUpsert(name, row);
    memo.delete(name); epoch++;
    return;
  }
  const rows = [...(await fileList(name))];
  const i = rows.findIndex((r) => (r as { id: string }).id === (row as { id: string }).id);
  if (i >= 0) rows[i] = row; else rows.push(row);
  await fileWrite(name, rows);
}

export async function remove(name: CollectionName, id: string): Promise<void> {
  if (usingSupabase()) {
    await sbRemove(name, id);
    memo.delete(name); epoch++;
    return;
  }
  const rows = (await fileList(name)).filter((r) => (r as { id: string }).id !== id);
  await fileWrite(name, rows as never);
}

export async function upsertMany<K extends CollectionName>(name: K, items: Collections[K][]): Promise<void> {
  if (usingSupabase()) {
    for (const it of items) await sbUpsert(name, it);
    memo.delete(name); epoch++;
    return;
  }
  const rows = [...(await fileList(name))];
  for (const row of items) {
    const i = rows.findIndex((r) => (r as { id: string }).id === (row as { id: string }).id);
    if (i >= 0) rows[i] = row; else rows.push(row);
  }
  await fileWrite(name, rows);
}
