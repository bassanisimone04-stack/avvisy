import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { clientIp, rateLimit } from "@/lib/ratelimit";

/** Compact model summaries for client-side lists (compare tray, saved list). */
export async function GET(req: Request) {
  if (!rateLimit(`models:${clientIp(req.headers)}`, 120, 60_000)) return NextResponse.json({ models: [] }, { status: 429 });
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 24);
  const c = await getCatalog();
  const models = ids.map((id) => c.modelById.get(id)).filter((m): m is NonNullable<typeof m> => !!m).map((m) => ({
    id: m.id, slug: m.slug, name: m.name, brand: c.brandById.get(m.brandId)?.name ?? "", match: c.modelMatch(m.id),
    shape: m.shape, frame: m.frameColor, lens: m.lensColor,
  }));
  return NextResponse.json({ models }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
