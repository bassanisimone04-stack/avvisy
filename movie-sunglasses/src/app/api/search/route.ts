import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { searchCatalog } from "@/lib/search";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function GET(req: Request) {
  if (!rateLimit(`search:${clientIp(req.headers)}`, 90, 60_000)) return NextResponse.json({ hits: [] }, { status: 429 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 80);
  const hits = searchCatalog(await getCatalog(), q, 12).map(({ score: _s, ...h }) => h);
  return NextResponse.json({ hits }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
