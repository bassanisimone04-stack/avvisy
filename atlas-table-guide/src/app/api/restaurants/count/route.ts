import { NextResponse, type NextRequest } from "next/server";
import { getDataset } from "@/db/repository";
import { getRates } from "@/lib/fx";
import { applyFilters, parseFilters } from "@/lib/filters";
import { resolveScope } from "@/features/directory/model";
import { restaurantsIn } from "@/db/queries";
import { rateLimit } from "@/lib/rate-limit";

/** Live result count for the mobile filter sheet. */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`count:${ip}`, 120, 60_000).ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const sp = req.nextUrl.searchParams;
  const [d, rates] = await Promise.all([getDataset(), getRates()]);
  const scope = resolveScope(d, sp.get("_country") || undefined, sp.get("_place") || undefined) ?? { kind: "global" as const };
  const f = { ...parseFilters(sp), country: scope.country, region: scope.region, city: scope.city };
  const count = applyFilters(restaurantsIn(d, scope), f, rates).length;
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
