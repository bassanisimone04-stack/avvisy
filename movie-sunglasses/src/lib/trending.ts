import { listAll } from "./store";
import type { Catalog } from "./catalog";
import type { SunglassesModel } from "./types";

/** Trending = views + 5×clicks over the last 30 days. With no traffic yet, falls back to the editorial order (best evidence first). */
export async function trendingModels(c: Catalog, limit: number): Promise<SunglassesModel[]> {
  const [views, clicks] = await Promise.all([listAll("views"), listAll("clicks")]);
  const since = new Date(Date.now() - 30 * 864e5);
  const iso = since.toISOString().slice(0, 10);
  const score = new Map<string, number>();
  for (const v of views) if (v.type === "model" && v.date >= iso) score.set(v.refId, (score.get(v.refId) ?? 0) + v.count);
  for (const k of clicks) if (new Date(k.at) >= since) score.set(k.modelId, (score.get(k.modelId) ?? 0) + 5);
  const order = ["exact", "official_reissue", "similar", "unconfirmed"];
  return [...c.screenModels]
    .sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0) || order.indexOf(c.modelMatch(a.id)) - order.indexOf(c.modelMatch(b.id)) || c.appsForModel(b.id).length - c.appsForModel(a.id).length)
    .slice(0, limit);
}
