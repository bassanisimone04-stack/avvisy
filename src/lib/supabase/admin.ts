import { createClient } from "@supabase/supabase-js";

/** Client Supabase con privilegi di servizio (bypassa le RLS).
 * DA USARE SOLO lato server in contesti fidati (es. webhook Stripe),
 * mai con dati dell'utente. Richiede SUPABASE_SERVICE_ROLE_KEY. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
