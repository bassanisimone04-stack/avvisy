import "server-only";
import { supabaseAnon, supabaseService } from "./supabase";

export type WriteResult = "stored" | "not-configured" | "duplicate" | "error";

/** Insert into an RLS-protected table. Service role when available (server only), else anon (insert-only policies). */
export async function insertRow(table: "newsletter_subscribers" | "form_submissions" | "affiliate_clicks" | "audit_logs", row: Record<string, unknown>): Promise<WriteResult> {
  const sb = supabaseService() ?? supabaseAnon();
  if (!sb) return "not-configured";
  const { error } = await sb.from(table).insert(row);
  if (!error) return "stored";
  if (error.code === "23505") return "duplicate";
  console.error(`[writes] ${table}`, error.message);
  return "error";
}
