import Link from "next/link";
import { listAll, storageMode } from "@/lib/store";
import { getCatalog } from "@/lib/catalog";
import { computeStats } from "@/lib/admin/stats";
import { aiInfo } from "@/lib/ai";
import { authConfigError } from "@/lib/auth-server";

export default async function Dashboard() {
  const [c, st, msgs, articles, offers] = await Promise.all([getCatalog(), computeStats(), listAll("messages"), listAll("articles"), listAll("offers")]);
  const unreviewed = c.models.filter((m) => !m.reviewed).length;
  const unconfirmed = c.appearances.filter((a) => c.matchOf(a).type === "unconfirmed").length;
  const downgraded = c.appearances.filter((a) => c.matchOf(a).downgraded).length;
  const ai = aiInfo();
  const stale = offers.filter((o) => Date.now() - new Date(o.lastChecked).getTime() > 14 * 864e5).length;
  const cards: [string, string | number, string][] = [
    ["Modelli", c.models.length, "/admin/models"], ["Film e serie", c.movies.length, "/admin/movies"], ["Attori", c.actors.length, "/admin/actors"],
    ["Identificazioni", c.appearances.length, "/admin/appearances"], ["Offerte inserite", offers.length, "/admin/offers"], ["Articoli", articles.length, "/admin/articles"],
  ];
  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">{cards.map(([l, n, h]) => <Link key={l} href={h} className="rounded-2xl bg-white p-4 shadow-sm hover:shadow"><p className="text-xs uppercase tracking-widest text-mist">{l}</p><p className="font-display text-4xl font-semibold">{n}</p></Link>)}</div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Da fare</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>📝 <Link className="underline" href="/admin/models">{unreviewed} modelli</Link> in attesa di revisione editoriale</li>
            <li>❓ {unconfirmed} identificazioni sono «Unconfirmed» ({downgraded} declassate automaticamente per prove insufficienti) — <Link className="underline" href="/admin/evidence">aggiungi fonti</Link></li>
            <li>💲 {offers.length === 0 ? "Nessuna offerta inserita: il comparatore mostra solo link di ricerca senza prezzo." : `${stale} offerte non controllate da più di 14 giorni.`} <Link className="underline" href="/admin/offers/new">Aggiungi offerta</Link></li>
            <li>✉️ <Link className="underline" href="/admin/messages">{msgs.filter((m) => !m.handled).length} messaggi</Link> da gestire</li>
            <li>📰 {articles.filter((a) => a.status === "brief").length} brief · {articles.filter((a) => a.status === "draft" || a.status === "in_review").length} bozze/in revisione · {articles.filter((a) => a.status === "published").length} pubblicati</li>
          </ul></section>
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Stato del sistema</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Archiviazione</dt><dd className="font-medium">{storageMode() === "supabase" ? "Supabase (Postgres)" : "File locale .data/store.json (solo sviluppo)"}</dd></div>
            <div className="flex justify-between"><dt>API AI bozze</dt><dd className="font-medium">{ai.configured ? `${ai.provider} · ${ai.model}` : "Non configurata"}</dd></div>
            <div className="flex justify-between"><dt>Login admin</dt><dd className="font-medium">{authConfigError() ? "Config incompleta" : "OK"}</dd></div>
            <div className="flex justify-between"><dt>Programmi affiliati attivi</dt><dd className="font-medium">{c.merchants.filter((m) => m.active && m.affiliateParams).length} con parametri</dd></div>
          </dl></section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Ultimi 30 giorni</h2>
        <dl className="mt-4 grid grid-cols-3 gap-4 text-sm"><div><dt className="text-mist">Visualizzazioni (aggregate)</dt><dd className="font-display text-3xl">{st.totals.views30}</dd></div><div><dt className="text-mist">Clic verso i negozi</dt><dd className="font-display text-3xl">{st.totals.clicks30}</dd></div><div><dt className="text-mist">CTR schede modello</dt><dd className="font-display text-3xl">{st.totals.ctr == null ? "—" : (st.totals.ctr * 100).toFixed(1) + "%"}</dd></div></dl>
        <p className="mt-3 text-sm"><Link className="underline" href="/admin/stats">Dettaglio statistiche e ricavi →</Link></p></section>
    </div>
  );
}
