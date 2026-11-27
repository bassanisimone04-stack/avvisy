"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { useApp } from "./providers";
import { Notice } from "@/components/ui/ui";
import { compareHref } from "@/lib/compare-url";
import { tx } from "@/i18n";

type Item = { key: string; name: string; href: string; sub: string };

/** Supabase is loaded on demand (≈180 KB) so it never weighs on the rest of the site. */
function useSupabase(): SupabaseClient | null {
  const [sb, setSb] = useState<SupabaseClient | null>(null);
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    let alive = true;
    import("@supabase/supabase-js").then(({ createClient }) => { if (alive) setSb(createClient(url, key)); });
    return () => { alive = false; };
  }, []);
  return sb;
}

export function FavouritesList({ index, labels }: { index: Item[]; labels: { empty: string; remove: string; count: string } }) {
  const { favourites, toggleFavourite } = useApp();
  const items = favourites.map((k) => index.find((i) => i.key === k)).filter((i): i is Item => !!i);
  if (!items.length) return <p className="rounded-[12px] border border-dashed border-line bg-white p-8 text-center text-stone">{labels.empty}</p>;
  return (
    <>
      <p className="mb-4 text-sm text-stone">{labels.count.replace("{n}", String(items.length))}</p>
      <ul className="divide-y divide-line rounded-[12px] border border-line bg-white">
        {items.map((i) => (
          <li key={i.key} className="flex items-center justify-between gap-3 p-4">
            <div><Link href={i.href} className="font-semibold hover:underline">{i.name}</Link><p className="text-sm text-stone">{i.sub}</p></div>
            <button type="button" onClick={() => toggleFavourite(i.key)} className="min-h-11 rounded-[8px] border border-line px-3 text-sm hover:border-carmine">{labels.remove}</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AccountPanel({ locale }: { locale: string }) {
  const T = (en: string, it: string) => tx(locale, en, it);
  const sb = useSupabase();
  const { favourites, compare } = useApp();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [plans, setPlans] = useState<{ at: string; url: string; plan: { title: string } }[]>([]);
  useEffect(() => {
    try { setPlans(JSON.parse(localStorage.getItem("atg:plans") ?? "[]")); } catch { setPlans([]); }
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);
  // Merge local favourites into the account once signed in
  useEffect(() => {
    if (!sb || !session) return;
    const rows = favourites.map((k) => { const [entity_type, entity_slug] = k.split(":"); return { user_id: session.user.id, entity_type, entity_slug }; });
    if (rows.length) void sb.from("favorites").upsert(rows, { onConflict: "user_id,entity_type,entity_slug", ignoreDuplicates: true });
  }, [sb, session, favourites]);

  const exportData = async () => {
    const local = { favourites, comparison: compare.map((c) => c.slug), plans, preferences: { currency: localStorage.getItem("atg:currency"), units: localStorage.getItem("atg:units") } };
    let remote: unknown = null;
    if (sb && session) {
      const [p, f, c, a] = await Promise.all([sb.from("profiles").select("*"), sb.from("favorites").select("*"), sb.from("comparisons").select("*"), sb.from("alerts").select("*")]);
      remote = { profile: p.data, favorites: f.data, comparisons: c.data, alerts: a.data };
    }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), local, account: remote }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "my-data.json"; a.click(); URL.revokeObjectURL(a.href);
  };
  const deleteAll = async () => {
    if (!window.confirm(T("Delete all data stored for you? This cannot be undone.", "Cancellare tutti i dati che ti riguardano? L'operazione non è reversibile."))) return;
    for (const k of ["atg:favs", "atg:compare", "atg:plans", "atg:recent", "atg:currency", "atg:units"]) localStorage.removeItem(k);
    if (sb && session) {
      const res = await fetch("/api/account/delete/", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
      setMsg(res.ok ? T("Your account and data were deleted.", "Account e dati cancellati.") : T("Local data deleted. Account deletion failed — contact us.", "Dati locali cancellati. La cancellazione dell'account non è riuscita: contattaci."));
      await sb.auth.signOut();
    } else setMsg(T("Data stored on this device was deleted.", "I dati salvati su questo dispositivo sono stati cancellati."));
    setTimeout(() => window.location.reload(), 1200);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-[12px] border border-line bg-white p-5 lg:col-span-1" aria-labelledby="signin">
        <h2 id="signin" className="font-sans text-base font-bold">{T("Sign in", "Accedi")}</h2>
        {!sb ? (
          <div className="mt-3"><Notice tone="warning">{T("Accounts are not configured on this deployment (Supabase Auth missing). Your favourites, comparisons and plans are kept on this device.", "Gli account non sono configurati su questa installazione (manca Supabase Auth). Preferiti, confronti e piani restano su questo dispositivo.")}</Notice></div>
        ) : session ? (
          <div className="mt-3 text-sm"><p>{T("Signed in as", "Accesso eseguito come")} <strong>{session.user.email}</strong>. {T("Local favourites are merged into your account.", "I preferiti locali vengono uniti al tuo account.")}</p><button type="button" onClick={() => sb.auth.signOut()} className="mt-3 min-h-11 rounded-[8px] border border-line px-4 font-semibold">{T("Sign out", "Esci")}</button></div>
        ) : (
          <form className="mt-3 space-y-2" onSubmit={async (e) => { e.preventDefault(); const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/${locale}/account/` } }); setMsg(error ? error.message : T("Check your inbox for a sign-in link.", "Controlla la posta: ti abbiamo inviato un link di accesso.")); }}>
            <label htmlFor="acc-email" className="block text-sm font-semibold">{T("Email", "Email")}</label>
            <input id="acc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="min-h-11 w-full rounded-[8px] border border-line px-3" />
            <button type="submit" className="min-h-11 w-full rounded-[8px] bg-carmine text-sm font-semibold text-white">{T("Email me a sign-in link", "Inviami un link di accesso")}</button>
          </form>
        )}
        {msg && <p role="status" className="mt-3 text-sm">{msg}</p>}
      </section>
      <section className="rounded-[12px] border border-line bg-white p-5" aria-labelledby="saved">
        <h2 id="saved" className="font-sans text-base font-bold">{T("Saved", "Salvati")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><Link href={`/${locale}/account/favourites/`} className="font-semibold text-carmine hover:underline">{T("Favourites", "Preferiti")} ({favourites.length})</Link></li>
          <li>{compare.length ? <Link href={compareHref(locale, compare.map((c) => c.slug))} className="font-semibold text-carmine hover:underline">{T("Current comparison", "Confronto in corso")} ({compare.length})</Link> : <span className="text-stone">{T("No comparison in progress", "Nessun confronto in corso")}</span>}</li>
          {plans.map((p) => <li key={p.at}><a href={p.url} className="hover:underline">{p.plan.title}</a> <span className="text-stone">· {p.at.slice(0, 10)}</span></li>)}
        </ul>
        <p className="mt-4 text-xs text-stone">{T("Price alerts and memberships require a signed-in account and are sent by email once email delivery is configured.", "Avvisi di prezzo e iscrizioni richiedono un account e vengono inviati via email quando l'invio email sarà configurato.")}</p>
      </section>
      <section className="rounded-[12px] border border-line bg-white p-5" aria-labelledby="privacy">
        <h2 id="privacy" className="font-sans text-base font-bold">{T("Your data (GDPR)", "I tuoi dati (GDPR)")}</h2>
        <p className="mt-2 text-sm text-stone">{T("Download everything we store about you, or delete it.", "Scarica tutto ciò che conserviamo su di te, oppure cancellalo.")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportData} className="min-h-11 rounded-[8px] border border-carmine px-4 text-sm font-semibold text-carmine hover:bg-blush">{T("Export my data", "Esporta i miei dati")}</button>
          <button type="button" onClick={deleteAll} className="min-h-11 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white hover:bg-red-700">{T("Delete my data", "Cancella i miei dati")}</button>
        </div>
      </section>
    </div>
  );
}
