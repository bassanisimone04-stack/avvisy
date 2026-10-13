"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "./server";

/**
 * Passwordless sign-in. Mobile groomers are a low-tech-tolerance audience —
 * a magic link removes password reset support load entirely.
 */
export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Sign-in is unavailable until Supabase is configured." };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") ?? "";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
