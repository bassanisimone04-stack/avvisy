import { NextResponse, type NextRequest } from "next/server";
import { getDataset } from "@/db/repository";
import { localizeDataset } from "@/db/queries";
import { search } from "@/lib/search";
import { buildSearchDocs } from "@/lib/search-docs";
import { typesenseSearch } from "@/lib/typesense";
import { rateLimit } from "@/lib/rate-limit";
import { isLocale } from "@/i18n";

/** Global search suggestions (restaurants, cities, chefs, cuisines, articles, hotels, experiences). */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`search:${ip}`, 60, 60_000).ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const lp = req.nextUrl.searchParams.get("locale") ?? "en";
  const locale = isLocale(lp) ? lp : "en";
  const d = localizeDataset(await getDataset(), locale);
  const typesense = await typesenseSearch(q, locale, 10);
  if (typesense) return NextResponse.json({ hits: typesense }, { headers: { "Cache-Control": "public, max-age=60", "X-Robots-Tag": "noindex" } });
  const docs = buildSearchDocs(d, locale);
  const hits = search(docs, q, 10).map(({ text: _text, boost: _b, score: _s, ...h }) => h);
  return NextResponse.json({ hits }, { headers: { "Cache-Control": "public, max-age=60", "X-Robots-Tag": "noindex" } });
}
