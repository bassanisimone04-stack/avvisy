"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "avvisy_session";

/**
 * ATTENZIONE — accesso DEMO, non è ancora sicurezza reale.
 * Domani questa verifica verrà sostituita da Supabase Auth
 * (email + password con hash lato server). L'impianto — pagina di login,
 * middleware che protegge /dashboard, cookie di sessione, logout — resta
 * identico: cambia solo il controllo qui sotto.
 */
const DEMO_EMAIL = "demo@avvisy.app";
const DEMO_PASSWORD = "avvisy";

type SignInState = { error: string | null };

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { error: "Email o password non corretti." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 ore
  });

  redirect("/dashboard");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
