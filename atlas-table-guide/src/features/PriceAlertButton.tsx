"use client";

import { useState } from "react";
import Link from "next/link";
import { tx } from "@/i18n";

/** "Alert me when the price changes" — needs a signed-in Supabase account (RLS limits rows to the owner). */
export function PriceAlertButton({ slug, locale }: { slug: string; locale: string }) {
  const T = (en: string, it: string) => tx(locale, en, it);
  const [state, setState] = useState<"idle" | "busy" | "done" | "signin" | "unavailable" | "error">("idle");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return <p className="text-xs text-stone">{T("Price alerts need accounts, which are not configured on this deployment.", "Gli avvisi di prezzo richiedono gli account, non configurati su questa installazione.")}</p>;
  return (
    <div>
      <button type="button" disabled={state === "busy" || state === "done"} onClick={async () => {
        setState("busy");
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const sb = createClient(url, key);
          const { data: s } = await sb.auth.getSession();
          if (!s.session) { setState("signin"); return; }
          const { data: r } = await sb.from("restaurants").select("id").eq("slug", slug).maybeSingle();
          if (!r) { setState("unavailable"); return; }
          const { error } = await sb.from("alerts").insert({ user_id: s.session.user.id, restaurant_id: r.id, kind: "price_change" });
          setState(error ? "error" : "done");
        } catch { setState("error"); }
      }} className="flex min-h-11 w-full items-center justify-center rounded-[8px] border border-line bg-white text-sm font-semibold hover:border-carmine disabled:opacity-60">
        {state === "done" ? T("Alert set ✓", "Avviso attivato ✓") : T("Alert me on price changes", "Avvisami se il prezzo cambia")}
      </button>
      <p role="status" className="mt-1 text-xs text-stone">
        {state === "signin" && <>{T("Sign in first: ", "Accedi prima: ")}<Link href={`/${locale}/account/`} className="underline">{T("account", "account")}</Link></>}
        {state === "unavailable" && T("This venue is not in the database yet.", "Questo locale non è ancora nel database.")}
        {state === "error" && T("Could not save the alert.", "Impossibile salvare l'avviso.")}
      </p>
    </div>
  );
}
