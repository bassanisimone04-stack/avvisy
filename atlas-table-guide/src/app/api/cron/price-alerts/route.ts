import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { supabaseService } from "@/db/supabase";
import { evaluateAlert, type PriceRow } from "@/lib/alerts";
import { BRAND, SITE_URL } from "@/config/brand";

/** Daily job (Vercel Cron, see vercel.json). Authorised with `Authorization: Bearer $CRON_SECRET`. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const sb = supabaseService();
  if (!secret || !sb) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: alerts, error } = await sb.from("alerts").select("id, user_id, restaurant_id, kind, threshold_amount, currency, last_notified_at, created_at, restaurants(name, slug)").eq("active", true).limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let sent = 0, skipped = 0;
  for (const a of alerts ?? []) {
    const { data: menus } = await sb.from("menus").select("id, name_en").eq("restaurant_id", a.restaurant_id);
    const ids = (menus ?? []).map((m) => m.id);
    const nameOf = (id: string) => menus?.find((m) => m.id === id)?.name_en ?? "Menu";
    const [{ data: hist }, { data: cur }] = await Promise.all([
      sb.from("price_history").select("menu_id, amount, currency, recorded_at").in("menu_id", ids).order("recorded_at", { ascending: false }).limit(50),
      sb.from("menu_prices").select("menu_id, amount, currency, updated_at").in("menu_id", ids),
    ]);
    const toRow = (r: { menu_id: string; amount: number | null; currency: string }, at: string): PriceRow => ({ amount: r.amount == null ? null : Number(r.amount), currency: r.currency, recorded_at: at, menu: nameOf(r.menu_id) });
    const ev = evaluateAlert(a as never, (hist ?? []).map((h) => toRow(h, h.recorded_at)), (cur ?? []).map((c) => toRow(c, c.updated_at)));
    if (!ev.notify) { skipped++; continue; }
    const { data: user } = await sb.auth.admin.getUserById(a.user_id);
    const email = user.user?.email;
    const rest = a.restaurants as unknown as { name: string; slug: string } | null;
    if (!email || !rest || !process.env.RESEND_API_KEY) { skipped++; continue; }
    const ok = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM ?? `${BRAND.shortName} <${BRAND.supportEmail}>`, to: email, subject: `Price update: ${rest.name}`, text: `${rest.name}\n\n${ev.lines.join("\n")}\n\n${SITE_URL}/en/restaurant/${rest.slug}/\n\nYou receive this because you set a price alert. Manage alerts in your account.` }),
    }).then((r) => r.ok).catch(() => false);
    if (ok) { await sb.from("alerts").update({ last_notified_at: new Date().toISOString() }).eq("id", a.id); sent++; } else skipped++;
  }
  return NextResponse.json({ checked: alerts?.length ?? 0, sent, skipped });
}
