import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { supabaseService } from "@/db/supabase";

/** Double opt-in confirmation link target. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const sb = supabaseService();
  const back = (s: string) => NextResponse.redirect(new URL(`/en/?newsletter=${s}`, req.url));
  if (!sb || token.length < 20) return back("invalid");
  const hash = createHash("sha256").update(token).digest("hex");
  const { data } = await sb.from("newsletter_subscribers").update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirm_token_hash: null }).eq("confirm_token_hash", hash).eq("status", "pending").select("id");
  return back(data?.length ? "confirmed" : "invalid");
}
