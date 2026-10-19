import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { upsert } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/ratelimit";

/**
 * Outbound affiliate redirect + click tracking. The destination ALWAYS comes from the database
 * (an offer URL or a merchant search template) — never from the query string — so it cannot be used as an open redirect.
 */
const searchTerm = (brand: string, name: string) => (name.toLowerCase().startsWith(brand.toLowerCase()) ? name : `${brand} ${name}`).trim();

export async function GET(req: Request) {
  const u = new URL(req.url);
  const mid = u.searchParams.get("m") ?? "", modelId = u.searchParams.get("model") ?? "", oid = u.searchParams.get("o") ?? "";
  let src = (u.searchParams.get("src") ?? "direct").slice(0, 80);
  const c = await getCatalog();
  const art = c.articles.find((a) => a.slug === u.searchParams.get("art"));
  if (art) src = `article:${art.slug}`;
  const merchant = c.merchantById.get(mid), model = c.modelById.get(modelId);
  if (!merchant || !model || !merchant.active) return NextResponse.redirect(new URL("/", req.url), 302);

  let dest: string | undefined;
  let kind: "offer" | "search" = "search";
  if (oid) {
    const offer = c.offers.find((o) => o.id === oid && o.merchantId === merchant.id && o.modelId === model.id);
    if (offer) { dest = offer.url; kind = "offer"; }
  }
  if (!dest && merchant.searchUrlTemplate) {
    dest = merchant.searchUrlTemplate.replace("{q}", encodeURIComponent(searchTerm(c.brandById.get(model.brandId)?.name ?? "", model.name)));
  }
  if (!dest) return NextResponse.redirect(new URL(`/sunglasses/${model.slug}`, req.url), 302);
  let target: URL;
  try { target = new URL(dest); } catch { return NextResponse.redirect(new URL("/", req.url), 302); }
  if (target.protocol !== "https:") return NextResponse.redirect(new URL("/", req.url), 302);
  if (merchant.affiliateParams) for (const [k, v] of new URLSearchParams(merchant.affiliateParams)) target.searchParams.set(k, v);

  const ua = req.headers.get("user-agent") ?? "";
  if (!/bot|crawl|spider|preview/i.test(ua) && rateLimit(`go:${clientIp(req.headers)}`, 60, 60_000)) {
    try {
      await upsert("clicks", { id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`, at: new Date().toISOString(), merchantId: merchant.id, modelId: model.id, offerId: kind === "offer" ? oid : undefined, src, kind });
    } catch { /* never block the user on logging failure */ }
  }
  return NextResponse.redirect(target.toString(), { status: 302, headers: { "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer-when-downgrade" } });
}
