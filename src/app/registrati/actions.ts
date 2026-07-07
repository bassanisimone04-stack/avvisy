"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, slugify } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "avvisy_session";

type State = { error: string | null; info?: string | null };

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
  if (!consent) return { error: "Devi accettare i termini per continuare." };

  if (isSupabaseConfigured()) {
    let registered = false;
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already") || msg.includes("registered")) {
          return { error: "Questa email è già registrata. Prova ad accedere." };
        }
        return { error: "Registrazione non riuscita. Riprova." };
      }

      if (data.session && data.user) {
        // Sessione attiva: crea la struttura di proprietà del nuovo utente.
        const { error: orgError } = await supabase
          .from("organizations")
          .insert({ slug: slugify(org), name: org, owner_id: data.user.id });
        if (orgError) {
          return {
            error:
              "Account creato, ma non è stato possibile creare la struttura. Accedi e riprova dall'onboarding.",
          };
        }
        registered = true;
      } else {
        // Conferma email attiva su Supabase: niente sessione finché non conferma.
        return {
          error: null,
          info: "Ti abbiamo inviato un'email di conferma. Aprila, conferma l'indirizzo e poi accedi.",
        };
      }
    } catch {
      return { error: "Servizio momentaneamente non disponibile. Riprova." };
    }
    if (registered) redirect("/onboarding");
    return { error: "Registrazione non riuscita. Riprova." };
  }

  // Solo quando Supabase NON è configurato: registrazione demo.
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
