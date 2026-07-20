// Rilevamento della configurazione Supabase.
// Se le variabili d'ambiente non sono presenti, l'app resta in "modalità demo"
// (dati finti in localStorage) e nulla si rompe.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** true quando URL e anon key sono configurati. */
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
