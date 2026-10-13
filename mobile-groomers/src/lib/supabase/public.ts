import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Session-less Supabase client for public directory reads.
 *
 * The cookie-backed server client in ./server.ts calls cookies(), which opts
 * every caller out of static rendering. Directory content is the same for
 * every visitor and needs no session, so it reads through this client instead
 * and city/listing pages stay statically generated.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
