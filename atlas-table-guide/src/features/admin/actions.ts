"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createAdminSession } from "@/lib/admin-session";
import { ADMIN_COOKIE, requireAdmin } from "./auth";
import { dryRunImport, type ImportReport } from "@/lib/csv-import";
import { getDataset } from "@/db/repository";
import { supabaseService } from "@/db/supabase";
import { rateLimit } from "@/lib/rate-limit";

export async function login(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!rateLimit("admin-login", 10, 60_000).ok) return { error: "Too many attempts." };
  const secret = process.env.NODE_ENV === "production" ? undefined : process.env.ADMIN_DEV_TOKEN;
  if (!secret || secret.length < 16) return { error: "Admin login is not configured (set ADMIN_DEV_TOKEN for development, or configure Supabase Auth)." };
  const given = Buffer.from(String(fd.get("token") ?? ""));
  const want = Buffer.from(secret);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return { error: "Invalid token." };
  (await cookies()).set(ADMIN_COOKIE, createAdminSession({ role: "admin", name: "dev-admin", exp: Date.now() + 8 * 3600_000 }, secret), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 8 * 3600 });
  redirect("/admin/");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login/");
}

export type ImportState = { report?: ImportReport; error?: string; committed?: number };

export async function runImport(_: ImportState, fd: FormData): Promise<ImportState> {
  const session = await requireAdmin("import:run");
  const file = fd.get("file");
  let csv = String(fd.get("csv") ?? "");
  if (file instanceof File && file.size > 0) {
    if (file.size > 2_000_000) return { error: "File too large (max 2 MB)." };
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") return { error: "Only .csv files are accepted." };
    csv = await file.text();
  }
  if (!csv.trim()) return { error: "Paste CSV or choose a file." };
  const d = await getDataset();
  const report = dryRunImport(csv, d.restaurants.map((r) => ({ id: r.id, slug: r.slug, name: r.name, lat: r.lat, lng: r.lng, website: r.website })));
  if (fd.get("mode") !== "commit") return { report };
  const sb = supabaseService();
  if (!sb) return { report, error: "Commit disabled: the database is not configured. The dry-run above is complete." };
  // Commit creates DRAFT, unverified rows only; editors publish after review.
  let committed = 0;
  for (const row of report.toInsert) {
    const { data: city } = await sb.from("cities").select("id, country_id").ilike("name_en", row.city).maybeSingle();
    if (!city) continue;
    const { error } = await sb.from("restaurants").insert({ slug: row.slug, name: row.name, city_id: city.id, country_id: city.country_id, lat: row.lat, lng: row.lng, website: row.website || null, source_url: row.source_url, publication_status: "draft", verification_status: "unverified" });
    if (!error) committed++;
  }
  await sb.from("audit_logs").insert({ actor_role: session.role, action: "import.commit", entity_type: "restaurants", diff: { rows: committed } });
  return { report, committed };
}

export async function archiveDemo(): Promise<{ message: string }> {
  const session = await requireAdmin("restaurant:publish");
  const sb = supabaseService();
  if (!sb) return { message: "Database not configured. To hide bundled demo data, set ALLOW_DEMO_DATA=false and redeploy." };
  const tables = ["restaurants", "hotels", "experiences", "itineraries", "articles", "gift_cards", "cities", "countries", "regions", "chefs", "destinations"];
  for (const t of tables) await sb.from(t).update({ publication_status: "archived" }).eq("is_demo", true);
  await sb.from("audit_logs").insert({ actor_role: session.role, action: "demo.archive", entity_type: "*", diff: { tables } });
  return { message: "All demo rows archived. Import real data from the CSV importer." };
}
