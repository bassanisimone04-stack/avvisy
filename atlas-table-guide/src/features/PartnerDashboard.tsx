"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { Notice } from "@/components/ui/ui";
import { tx } from "@/i18n";

type Partner = { id: string; company: string; verified: boolean; plan: string };
type Claim = { id: string; status: "pending" | "approved" | "rejected"; restaurant_id: string | null; restaurants: { name: string; slug: string; website: string | null; phone: string | null; email: string | null; description_en: string | null } | null };
type Menu = { id: string; name_en: string };
const field = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-sm";

/**
 * Partner dashboard. Every write goes through Supabase with the partner's own session, so the database
 * (RLS + triggers) decides what is allowed: approved+verified claims only, never editorial fields,
 * prices can only be saved as "estimated" until a verifier confirms them.
 */
export function PartnerDashboard({ locale }: { locale: string }) {
  const T = (en: string, it: string) => tx(locale, en, it);
  const [sb, setSb] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [menus, setMenus] = useState<Record<string, Menu[]>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!url || !key) return;
    let alive = true;
    import("@supabase/supabase-js").then(({ createClient }) => {
      if (!alive) return;
      const c = createClient(url, key);
      setSb(c);
      c.auth.getSession().then(({ data }) => setSession(data.session));
      c.auth.onAuthStateChange((_e, s) => setSession(s));
    });
    return () => { alive = false; };
  }, [url, key]);

  const load = useCallback(async () => {
    if (!sb || !session) return;
    const { data: p } = await sb.from("partners").select("id, company, verified, plan").eq("user_id", session.user.id).maybeSingle();
    setPartner(p as Partner | null);
    if (!p) return;
    const { data: c } = await sb.from("partner_claims").select("id, status, restaurant_id, restaurants(name, slug, website, phone, email, description_en)").eq("partner_id", p.id);
    const list = (c ?? []) as unknown as Claim[];
    setClaims(list);
    const approved = list.filter((x) => x.status === "approved" && x.restaurant_id);
    const out: Record<string, Menu[]> = {};
    for (const a of approved) { const { data: m } = await sb.from("menus").select("id, name_en").eq("restaurant_id", a.restaurant_id!); out[a.restaurant_id!] = (m ?? []) as Menu[]; }
    setMenus(out);
  }, [sb, session]);
  useEffect(() => { void load(); }, [load]);

  if (!url || !key) return <Notice tone="warning">{T("The partner dashboard needs accounts (Supabase), which are not configured on this deployment.", "La dashboard partner richiede gli account (Supabase), non configurati su questa installazione.")}</Notice>;
  if (session === undefined) return <p className="text-sm text-stone">…</p>;
  if (!session) {
    return (
      <form className="max-w-sm space-y-2" onSubmit={async (e) => { e.preventDefault(); const email = String(new FormData(e.currentTarget).get("email")); const { error } = await sb!.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/${locale}/business/dashboard/` } }); setMsg(error ? error.message : T("Check your inbox for a sign-in link.", "Controlla la posta: ti abbiamo inviato un link di accesso.")); }}>
        <label htmlFor="pd-email" className="block text-sm font-semibold">Email</label>
        <input id="pd-email" name="email" type="email" required autoComplete="email" className={field} />
        <button type="submit" className="min-h-11 w-full rounded-[8px] bg-carmine text-sm font-semibold text-white">{T("Email me a sign-in link", "Inviami un link di accesso")}</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </form>
    );
  }
  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>, ok: string) => { const { error } = await fn(); setMsg(error ? `${T("Not saved", "Non salvato")}: ${error.message}` : ok); void load(); };

  return (
    <div className="space-y-8">
      {msg && <p role="status" className="rounded-[8px] border border-line bg-white p-3 text-sm">{msg}</p>}
      {!partner ? (
        <form className="max-w-md space-y-2 rounded-[12px] border border-line bg-white p-5" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); void run(() => sb!.from("partners").insert({ user_id: session.user.id, company: String(fd.get("company")), contact_email: String(fd.get("email")) }), T("Partner profile created. An editor will verify it.", "Profilo partner creato. Un editor lo verificherà.")); }}>
          <h2 className="text-lg">{T("Create your partner profile", "Crea il tuo profilo partner")}</h2>
          <label htmlFor="pc" className="block text-sm font-semibold">{T("Company", "Azienda")}</label><input id="pc" name="company" required className={field} />
          <label htmlFor="pe" className="block text-sm font-semibold">{T("Business email (on the venue's domain)", "Email aziendale (sul dominio del locale)")}</label><input id="pe" name="email" type="email" required className={field} />
          <button type="submit" className="min-h-11 rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white">{T("Create", "Crea")}</button>
        </form>
      ) : (
        <>
          <p className="text-sm">{partner.company} · {partner.plan} · {partner.verified ? <span className="font-semibold text-success">{T("verified", "verificato")}</span> : <span className="font-semibold text-warning">{T("awaiting verification", "in attesa di verifica")}</span>}</p>
          <form className="flex max-w-xl flex-wrap items-end gap-2 rounded-[12px] border border-line bg-white p-4" onSubmit={async (e) => {
            e.preventDefault(); const fd = new FormData(e.currentTarget);
            const { data: r } = await sb!.from("restaurants").select("id").eq("slug", String(fd.get("slug")).trim()).maybeSingle();
            if (!r) { setMsg(T("No restaurant with that slug in the database.", "Nessun ristorante con questo slug nel database.")); return; }
            void run(() => sb!.from("partner_claims").insert({ partner_id: partner.id, restaurant_id: r.id, status: "pending", evidence_kind: String(fd.get("evidence")) }), T("Claim submitted for review.", "Rivendicazione inviata per la verifica."));
          }}>
            <div className="min-w-48 flex-1"><label htmlFor="cl-slug" className="mb-1 block text-sm font-semibold">{T("Restaurant slug", "Slug del ristorante")}</label><input id="cl-slug" name="slug" required placeholder="maison-lune-paris" className={field} /></div>
            <div><label htmlFor="cl-ev" className="mb-1 block text-sm font-semibold">{T("Verification", "Verifica")}</label><select id="cl-ev" name="evidence" className={field}><option value="email-domain">{T("Email domain", "Dominio email")}</option><option value="document">{T("Document", "Documento")}</option><option value="phone-callback">{T("Phone call-back", "Richiamata")}</option></select></div>
            <button type="submit" className="min-h-11 rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white">{T("Claim", "Rivendica")}</button>
          </form>
          {claims.map((c) => (
            <section key={c.id} className="rounded-[12px] border border-line bg-white p-5">
              <h2 className="text-lg">{c.restaurants?.name} <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-xs font-semibold">{c.status}</span></h2>
              {c.status !== "approved" ? <p className="mt-1 text-sm text-stone">{T("You can edit this venue once an editor approves the claim.", "Potrai modificare questo locale quando un editor approverà la rivendicazione.")}</p> : (
                <div className="mt-3 grid gap-6 lg:grid-cols-2">
                  <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); void run(() => sb!.from("restaurants").update({ website: String(fd.get("website")) || null, phone: String(fd.get("phone")) || null, email: String(fd.get("email")) || null, description_en: String(fd.get("description")) || null }).eq("id", c.restaurant_id!), T("Saved.", "Salvato.")); }}>
                    <p className="text-sm font-semibold">{T("Details", "Dati")}</p>
                    <input name="website" type="url" defaultValue={c.restaurants?.website ?? ""} placeholder="https://" aria-label="Website" className={field} />
                    <input name="phone" defaultValue={c.restaurants?.phone ?? ""} placeholder="+39…" aria-label={T("Phone", "Telefono")} className={field} />
                    <input name="email" type="email" defaultValue={c.restaurants?.email ?? ""} aria-label="Email" className={field} />
                    <textarea name="description" rows={4} defaultValue={c.restaurants?.description_en ?? ""} aria-label={T("Description", "Descrizione")} className={`${field} py-2`} />
                    <button type="submit" className="min-h-11 rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white">{T("Save", "Salva")}</button>
                  </form>
                  <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); void run(() => sb!.from("menu_prices").insert({ menu_id: String(fd.get("menu")), amount: Number(fd.get("amount")), currency: String(fd.get("currency")).toUpperCase(), status: "estimated", source_url: String(fd.get("source")), collected_at: new Date().toISOString().slice(0, 10) }), T("Price saved as “estimated”; a verifier will confirm it.", "Prezzo salvato come «stimato»: un verificatore lo confermerà.")); }}>
                    <p className="text-sm font-semibold">{T("Update a price", "Aggiorna un prezzo")}</p>
                    <select name="menu" aria-label="Menu" className={field}>{(menus[c.restaurant_id!] ?? []).map((m) => <option key={m.id} value={m.id}>{m.name_en}</option>)}</select>
                    <div className="grid grid-cols-2 gap-2"><input name="amount" type="number" min={0} step="0.01" required placeholder={T("Amount", "Importo")} aria-label={T("Amount", "Importo")} className={field} /><input name="currency" maxLength={3} defaultValue="EUR" aria-label={T("Currency", "Valuta")} className={field} /></div>
                    <input name="source" type="url" required placeholder={T("Source URL (your menu page)", "URL della fonte (la tua pagina del menu)")} aria-label="Source" className={field} />
                    <button type="submit" className="min-h-11 rounded-[8px] border border-carmine px-5 text-sm font-semibold text-carmine">{T("Save price", "Salva prezzo")}</button>
                  </form>
                </div>
              )}
            </section>
          ))}
        </>
      )}
      <button type="button" onClick={() => sb?.auth.signOut()} className="min-h-11 text-sm text-stone underline">{T("Sign out", "Esci")}</button>
    </div>
  );
}
