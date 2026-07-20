"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

/** Login con email e password (Supabase Auth). */
export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/accedi?error=Supabase%20non%20configurato");

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/accedi?error=${encodeURIComponent(error.message)}`);

  const redirectTo = String(formData.get("redirect") ?? "/venditore");
  redirect(redirectTo || "/venditore");
}

/** Registrazione: crea l'utente e il profilo azienda collegato. */
export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/registrati?error=Supabase%20non%20configurato");

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ragioneSociale = String(formData.get("ragioneSociale") ?? "");
  const displayName = ragioneSociale.replace(/\s+(S\.r\.l\.|S\.p\.A\.|Srl|Spa)\.?$/i, "").trim() || ragioneSociale;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/registrati?error=${encodeURIComponent(error.message)}`);

  const uid = data.user?.id;
  if (uid) {
    await supabase.from("companies").insert({
      owner: uid,
      ragione_sociale: ragioneSociale || "Nuova Azienda",
      display_name: displayName || "Nuova Azienda",
      vat_number: String(formData.get("vatNumber") ?? ""),
      sector: String(formData.get("sector") ?? ""),
      region: String(formData.get("region") ?? ""),
      province: String(formData.get("province") ?? ""),
      verification: "In verifica",
      logo: displayName.slice(0, 2).toUpperCase(),
    });
  }

  redirect(data.session ? "/venditore" : "/accedi?registrato=1");
}

/** Logout. */
export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
