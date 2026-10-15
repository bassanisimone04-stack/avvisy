import fs from "node:fs";
import path from "node:path";
import type { CollectionName, Collections } from "../types";
import { seed } from "@/data/seed";

const FILE = path.join(process.cwd(), ".data", "store.json");
type Overlay = Partial<{ [K in CollectionName]: Collections[K][] }>;
let cache: { mtime: number; data: Overlay } | null = null;
let queue: Promise<unknown> = Promise.resolve();

function readOverlay(): Overlay {
  try {
    const st = fs.statSync(FILE);
    if (cache && cache.mtime === st.mtimeMs) return cache.data;
    const data = JSON.parse(fs.readFileSync(FILE, "utf8")) as Overlay;
    cache = { mtime: st.mtimeMs, data };
    return data;
  } catch {
    return {};
  }
}

export async function fileList<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  const o = readOverlay();
  return (o[name] ?? seed[name]) as Collections[K][];
}

export function fileWrite<K extends CollectionName>(name: K, rows: Collections[K][]): Promise<void> {
  const run = async () => {
    const o = { ...readOverlay(), [name]: rows } as Overlay;
    try {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      const tmp = FILE + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(o, null, 2));
      fs.renameSync(tmp, FILE);
      cache = null;
    } catch (e) {
      throw new Error("Impossibile scrivere sul file system (ambiente in sola lettura?). Configura Supabase per la persistenza in produzione. " + (e as Error).message);
    }
  };
  const p = queue.then(run, run);
  queue = p.catch(() => undefined);
  return p;
}

export function fileVersion(): string {
  try { return String(fs.statSync(FILE).mtimeMs); } catch { return "seed"; }
}
