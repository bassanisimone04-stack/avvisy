import "server-only";
import { listAll } from "../store";

export interface Stats {
  days: { date: string; views: number; clicks: number }[];
  totals: { views30: number; clicks30: number; ctr: number | null; clicksAll: number };
  topModels: { id: string; name: string; clicks: number; views: number; ctr: number | null }[];
  topArticles: { slug: string; title: string; views: number; clicks: number; estimated: number }[];
  merchants: { id: string; name: string; clicks: number; epc: number; estimated: number; reported: number }[];
  reportedTotal: number; estimatedTotal: number;
}

export async function computeStats(): Promise<Stats> {
  const [views, clicks, models, merchants, revenue, articles] = await Promise.all([listAll("views"), listAll("clicks"), listAll("models"), listAll("merchants"), listAll("revenue"), listAll("articles")]);
  const since = new Date(Date.now() - 29 * 864e5);
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const days = Array.from({ length: 30 }, (_, i) => ({ date: dayKey(new Date(since.getTime() + i * 864e5)), views: 0, clicks: 0 }));
  const idx = new Map(days.map((d, i) => [d.date, i]));
  let views30 = 0, clicks30 = 0, modelViews30 = 0;
  const mClicks = new Map<string, number>(), mViews = new Map<string, number>();
  const aViews = new Map<string, number>(), aClicks = new Map<string, number>();
  for (const v of views) { const i = idx.get(v.date); if (i == null) continue; days[i].views += v.count; views30 += v.count;
    if (v.type === "model") { mViews.set(v.refId, (mViews.get(v.refId) ?? 0) + v.count); modelViews30 += v.count; }
    if (v.type === "article") aViews.set(v.refId, (aViews.get(v.refId) ?? 0) + v.count); }
  const merchClicks = new Map<string, number>();
  for (const k of clicks) {
    merchClicks.set(k.merchantId, (merchClicks.get(k.merchantId) ?? 0) + 1);
    const i = idx.get(k.at.slice(0, 10)); if (i == null) continue;
    days[i].clicks++; clicks30++;
    mClicks.set(k.modelId, (mClicks.get(k.modelId) ?? 0) + 1);
    if (k.src.startsWith("article:")) aClicks.set(k.src.slice(8), (aClicks.get(k.src.slice(8)) ?? 0) + 1);
  }
  const epc = new Map(merchants.map((m) => [m.id, m.estimatedEpc ?? 0]));
  const clickEstimate = (list: typeof clicks) => list.reduce((s, k) => s + (epc.get(k.merchantId) ?? 0), 0);
  const artEst = new Map<string, number>();
  for (const k of clicks) if (k.src.startsWith("article:")) artEst.set(k.src.slice(8), (artEst.get(k.src.slice(8)) ?? 0) + (epc.get(k.merchantId) ?? 0));
  const reportedBy = new Map<string, number>();
  let reportedTotal = 0;
  for (const r of revenue) if (r.kind === "reported") { reportedBy.set(r.merchantId, (reportedBy.get(r.merchantId) ?? 0) + r.amount); reportedTotal += r.amount; }
  return {
    days,
    totals: { views30, clicks30, ctr: modelViews30 ? clicks30 / modelViews30 : null, clicksAll: clicks.length },
    topModels: models.map((m) => ({ id: m.id, name: m.name, clicks: mClicks.get(m.id) ?? 0, views: mViews.get(m.id) ?? 0, ctr: (mViews.get(m.id) ?? 0) ? (mClicks.get(m.id) ?? 0) / mViews.get(m.id)! : null }))
      .filter((m) => m.clicks || m.views).sort((a, b) => b.clicks - a.clicks || b.views - a.views).slice(0, 10),
    topArticles: articles.filter((a) => aViews.has(a.id) || aClicks.has(a.slug)).map((a) => ({ slug: a.slug, title: a.title, views: aViews.get(a.id) ?? 0, clicks: aClicks.get(a.slug) ?? 0, estimated: artEst.get(a.slug) ?? 0 }))
      .sort((a, b) => b.estimated - a.estimated || b.clicks - a.clicks || b.views - a.views).slice(0, 10),
    merchants: merchants.map((m) => ({ id: m.id, name: m.name, clicks: merchClicks.get(m.id) ?? 0, epc: epc.get(m.id) ?? 0, estimated: clickEstimate(clicks.filter((k) => k.merchantId === m.id)), reported: reportedBy.get(m.id) ?? 0 })),
    reportedTotal, estimatedTotal: clickEstimate(clicks),
  };
}
