import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { getDataset } from "@/db/repository";
import { insertRow } from "@/db/writes";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseService } from "@/db/supabase";

/**
 * Affiliate redirect: /go/{id}/ → partner URL (302), logging the click (hashed IP, no cookies).
 * Rate-limited; noindex; disallowed in robots.txt. Links to it carry rel="sponsored nofollow noopener".
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`go:${ip}`, 30, 60_000).ok) return new NextResponse("Too many requests", { status: 429 });
  const d = await getDataset();
  const link = d.affiliateLinks.find((l) => l.id === id);
  if (!link || !/^https:\/\//.test(link.url)) return new NextResponse("Unknown link", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  const from = req.nextUrl.searchParams.get("from")?.slice(0, 200) ?? null;
  const sb = supabaseService();
  if (sb) {
    const { data: row } = await sb.from("affiliate_links").select("id").eq("code", id).maybeSingle();
    if (row) await insertRow("affiliate_clicks", { link_id: row.id, referrer_path: from, ip_hash: createHash("sha256").update(ip + (process.env.IP_HASH_SALT ?? "")).digest("hex").slice(0, 32), user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null });
  } else {
    console.info(`[affiliate] click ${id} from ${from ?? "-"} (not persisted: database not configured)`);
  }
  return NextResponse.redirect(link.url, { status: 302, headers: { "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer-when-downgrade", "Cache-Control": "no-store" } });
}
