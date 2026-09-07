// Supabase configuration detection.
// When the environment variables are absent the app stays in "demo mode",
// reading listings from src/data/groomers.json, and nothing breaks.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** true when both the URL and the anon key are configured. */
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
