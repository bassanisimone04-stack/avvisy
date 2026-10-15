import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { getById, upsert } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

/** Cookie-free aggregate counter: no IP, UA or identifier is stored. */
export async function POST(req: Request) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  if (!rateLimit(`track:${clientIp(req.headers)}`, 120, 60_000)) return new NextResponse(null, { status: 429 });
  let body: { type?: string; id?: string };
  try { body = JSON.parse(await req.text()); } catch { return new NextResponse(null, { status: 400 }); }
  const { type, id } = body;
  if (!id || (type !== "model" && type !== "article" && type !== "movie")) return new NextResponse(null, { status: 400 });
  const c = await getCatalog();
  const exists = type === "model" ? c.modelById.has(id) : type === "movie" ? c.movieById.has(id) : c.articles.some((a) => a.id === id);
  if (!exists) return new NextResponse(null, { status: 404 });
  const date = new Date().toISOString().slice(0, 10);
  const rid = `${type}:${id}:${date}`;
  try {
    const cur = await getById("views", rid);
    await upsert("views", { id: rid, type, refId: id, date, count: (cur?.count ?? 0) + 1 });
  } catch { /* read-only storage: analytics are best-effort */ }
  return new NextResponse(null, { status: 204 });
}
