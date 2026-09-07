import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** true when the server-only service-role key is available. */
export const isAdminConfigured =
  SUPABASE_URL.length > 0 && SERVICE_ROLE_KEY.length > 0;

/**
 * Service-role Supabase client. Bypasses RLS, so it must never be imported
 * into a client component — only route handlers and server actions.
 *
 * Needed wherever there is no user session to authenticate: the Stripe
 * webhook, and the lead endpoint (which must count existing leads to rate
 * limit, and read the groomer's private email to forward the lead — neither
 * is readable by an anonymous visitor, by design).
 */
export function createAdminClient() {
  if (!isAdminConfigured) return null;
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
