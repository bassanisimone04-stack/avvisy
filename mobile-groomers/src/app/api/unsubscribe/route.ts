import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

/**
 * Records an outreach opt-out. Deliberately forgiving: an address that is
 * already suppressed, or that we have no record of, still returns success —
 * the person asked not to be contacted, and arguing about it is both rude
 * and a compliance risk.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, stored: false, mode: "demo" });
  }

  const supabase = createPublicClient();
  if (!supabase) return NextResponse.json({ ok: true, stored: false, mode: "demo" });

  const { error } = await supabase
    .from("suppressions")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: "Could not record the request." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
