"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "avvisy_session";

/**
 * Registrazione DEMO: verifica solo il formato dei campi e apre una sessione.
 * Con Supabase Auth diventerà creazione utente reale (email + password hashata)
 * e invio email di conferma. L'impianto (pagina, sessione, redirect) resta.
 */
type State = { error: string | null };

export async function signUp(_prev: State, formData: FormData): Promise<State> {
  const org = String(formData.get("org") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const consent = formData.get("consent");

  if (org.length < 2) return { error: "Inserisci il nome della struttura." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Inserisci un'email valida." };
  if (password.length < 8)
    return { error: "La password deve avere almeno 8 caratteri." };
  if (!consent)
    return { error: "Devi accettare i termini per continuare." };

  const store = await cookies();
  store.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/onboarding");
}
