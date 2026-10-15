import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { listAll } from "@/lib/store";
import { auditSite } from "@/lib/seo-audit";

export const dynamic = "force-dynamic";

export default async function SeoAudit({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const [c, kws] = await Promise.all([getCatalog(), listAll("keywords")]);
  const a = auditSite(c, kws);
  const rows = (sp.all ? a.rows : a.rows.filter((r) => r.issues.length)).sort((x, y) => y.issues.length - x.issues.length);
  const withVol = kws.filter((k) => k.volume != null).length;
  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-4xl font-semibold">Audit SEO</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate">Controlla title, description, contenuti sottili, duplicati e cannibalizzazione delle keyword su tutte le pagine generate. I volumi di ricerca non sono misurabili qui: servono Search Console, Semrush o Ahrefs.</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Pagine controllate", a.total], ["Con segnalazioni", a.withIssues], ["Keyword con volume", `${withVol}/${kws.length}`], ["Keyword senza pagina", a.unmapped]].map(([l, v]) => <div key={String(l)} className="rounded-2xl bg-white p-4 shadow-sm"><dt className="text-xs uppercase tracking-widest text-mist">{l}</dt><dd className="font-display text-3xl">{v}</dd></div>)}
      </dl>
      {a.cannibal.length > 0 && <section className="mt-6 rounded-2xl border-l-4 border-champagne bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Possibile cannibalizzazione</h2><ul className="mt-2 list-disc pl-5 text-sm">{a.cannibal.map((x) => <li key={x}>{x}</li>)}</ul></section>}
      <p className="mt-6 text-sm">{sp.all ? <Link className="underline" href="/admin/seo">Mostra solo le pagine con segnalazioni</Link> : <Link className="underline" href="/admin/seo?all=1">Mostra tutte le pagine</Link>}</p>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-widest text-mist"><th className="px-4 py-3">Pagina</th><th className="px-4 py-3">Title (lung.)</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Segnalazioni</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.url} className="border-b border-line/60 align-top last:border-0">
              <td className="px-4 py-3"><Link className="underline" href={r.url} target="_blank">{r.url}</Link><br /><span className="text-xs text-mist">{r.kind}</span></td>
              <td className="max-w-xs px-4 py-3">{r.title} <span className={r.title.length > 60 ? "text-red-700" : "text-mist"}>({r.title.length})</span></td>
              <td className="max-w-sm px-4 py-3 text-slate">{r.description || "—"} <span className={r.description.length > 155 ? "text-red-700" : "text-mist"}>({r.description.length})</span></td>
              <td className="px-4 py-3">{r.issues.length ? <ul className="list-disc pl-4 text-amber-900">{r.issues.map((i) => <li key={i}>{i}</li>)}</ul> : <span className="text-green-800">OK</span>}</td>
            </tr>))}
            {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-green-800">Nessuna segnalazione.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
