import { computeStats } from "@/lib/admin/stats";
import { formatPrice } from "@/lib/format";

export default async function StatsPage() {
  const s = await computeStats();
  const max = Math.max(1, ...s.days.map((d) => Math.max(d.views, d.clicks)));
  const th = "px-3 py-2 text-xs font-medium uppercase tracking-widest text-mist";
  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-4xl font-semibold">Statistiche e ricavi</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate">Le visualizzazioni sono contatori aggregati senza cookie né IP. Per visite organiche da Google usa Search Console/GA4. I ricavi <strong>reali</strong> provengono solo da report delle reti affiliate che inserisci in «Ricavi»; quelli <strong>stimati</strong> sono clic × EPC ipotizzato e non vanno mai sommati ai reali.</p>
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Ultimi 30 giorni</h2>
        <div role="img" aria-label="Visualizzazioni e clic per giorno" className="mt-4 flex h-40 items-end gap-1">
          {s.days.map((d) => (<div key={d.date} className="flex flex-1 flex-col items-center justify-end gap-px" title={`${d.date}: ${d.views} viste, ${d.clicks} clic`}>
            <div className="w-full rounded-t bg-champagne" style={{ height: `${(d.clicks / max) * 100}%`, minHeight: d.clicks ? 2 : 0 }} /><div className="w-full bg-ink/80" style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views ? 2 : 0 }} /></div>))}
        </div>
        <p className="mt-2 flex gap-4 text-xs text-slate"><span><span className="mr-1 inline-block h-2 w-2 bg-ink/80" />Visualizzazioni</span><span><span className="mr-1 inline-block h-2 w-2 bg-champagne" />Clic verso i negozi</span></p>
        <dl className="mt-4 grid grid-cols-3 gap-4 text-sm"><div><dt className="text-mist">Viste</dt><dd className="font-display text-3xl">{s.totals.views30}</dd></div><div><dt className="text-mist">Clic</dt><dd className="font-display text-3xl">{s.totals.clicks30}</dd></div><div><dt className="text-mist">CTR affiliato (clic / viste schede modello)</dt><dd className="font-display text-3xl">{s.totals.ctr == null ? "—" : (s.totals.ctr * 100).toFixed(1) + "%"}</dd></div></dl></section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Ricavi REALI (da report)</h2><p className="font-display text-4xl">{formatPrice(s.reportedTotal)}</p><p className="mt-1 text-xs text-slate">Somma delle voci «Reale» in Ricavi. 0 finché non inserisci un report.</p></div>
        <div className="rounded-2xl border-2 border-dashed border-champagne bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Ricavi STIMATI <span className="rounded bg-champagne-light px-2 py-0.5 align-middle text-xs uppercase tracking-widest text-champagne-text">stima</span></h2><p className="font-display text-4xl">{formatPrice(s.estimatedTotal)}</p><p className="mt-1 text-xs text-slate">Clic totali × EPC stimato per negozio. È un'ipotesi, non un incasso.</p></div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Per negozio</h2>
        <table className="mt-3 w-full text-left text-sm"><thead><tr><th className={th}>Negozio</th><th className={th}>Clic (totali)</th><th className={th}>EPC stimato</th><th className={th}>Stimato</th><th className={th}>Reale</th></tr></thead><tbody>
          {s.merchants.map((m) => <tr key={m.id} className="border-t border-line/60"><td className="px-3 py-2">{m.name}</td><td className="px-3">{m.clicks}</td><td className="px-3">{formatPrice(m.epc)}</td><td className="px-3 text-slate">{formatPrice(m.estimated)} (stima)</td><td className="px-3">{formatPrice(m.reported)}</td></tr>)}</tbody></table></section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Modelli più cliccati</h2>
          <table className="mt-3 w-full text-left text-sm"><thead><tr><th className={th}>Modello</th><th className={th}>Clic</th><th className={th}>Viste</th><th className={th}>CTR</th></tr></thead><tbody>
            {s.topModels.map((m) => <tr key={m.id} className="border-t border-line/60"><td className="px-3 py-2">{m.name}</td><td className="px-3">{m.clicks}</td><td className="px-3">{m.views}</td><td className="px-3">{m.ctr == null ? "—" : (m.ctr * 100).toFixed(1) + "%"}</td></tr>)}
            {s.topModels.length === 0 && <tr><td colSpan={4} className="px-3 py-6 text-center text-slate">Ancora nessun dato.</td></tr>}</tbody></table></div>
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">Articoli più redditizi (stima)</h2>
          <table className="mt-3 w-full text-left text-sm"><thead><tr><th className={th}>Articolo</th><th className={th}>Viste</th><th className={th}>Clic</th><th className={th}>Stima</th></tr></thead><tbody>
            {s.topArticles.map((a) => <tr key={a.slug} className="border-t border-line/60"><td className="px-3 py-2">{a.title}</td><td className="px-3">{a.views}</td><td className="px-3">{a.clicks}</td><td className="px-3">{formatPrice(a.estimated)}</td></tr>)}
            {s.topArticles.length === 0 && <tr><td colSpan={4} className="px-3 py-6 text-center text-slate">Ancora nessun dato.</td></tr>}</tbody></table>
          <p className="mt-2 text-xs text-slate">I clic sono attribuiti all'ultimo articolo letto nella sessione.</p></div>
      </section>
    </div>
  );
}
