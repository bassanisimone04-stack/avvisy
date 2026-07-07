"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "avvisy_session";

// Accesso demo di ripiego: usato quando Supabase non è configurato o non è
// raggiungibile (es. in questo ambiente di sviluppo con la rete chiusa).
const DEMO_EMAIL = "demo@avvisy.app";
const DEMO_PASSWORD = "avvisy";

type SignInState = { error: string | null };

async function setDemoSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (isSupabaseConfigured()) {
    // Supabase è la fonte di verità: nessun ripiego demo (sarebbe una falla).
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: "Email o password non corretti." };
    } catch {
      return { error: "Servizio momentaneamente non disponibile. Riprova." };
    }
    redirect("/dashboard");
  }

  // Solo quando Supabase NON è configurato: accesso demo.
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { error: "Email o password non corretti." };
  }
  await setDemoSession(email);
  redirect("/dashboard");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignora: la sessione demo è comunque già stata rimossa
    }
  }

  redirect("/login");
}

/** Invia l'email con il link per reimpostare la password.
 * Ritorna sempre ok per non rivelare quali email sono registrate. */
export async function requestPasswordReset(
  email: string
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const h = await headers();
    const origin =
      h.get("origin") ??
      (h.get("host") ? `https://${h.get("host")}` : "");
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${origin}/reset-password`,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
