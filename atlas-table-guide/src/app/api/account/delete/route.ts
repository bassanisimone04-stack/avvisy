import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnon, supabaseService } from "@/db/supabase";

/** GDPR erasure: verifies the caller's JWT, then deletes the auth user (cascades to profile, favourites, alerts…). */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const anon = supabaseAnon();
  const admin = supabaseService();
  if (!token || !anon || !admin) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const { data, error } = await anon.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const del = await admin.auth.admin.deleteUser(data.user.id);
  if (del.error) return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  await admin.from("audit_logs").insert({ actor_id: data.user.id, actor_role: "user", action: "account.delete", entity_type: "profile", entity_id: data.user.id });
  return NextResponse.json({ ok: true });
}
