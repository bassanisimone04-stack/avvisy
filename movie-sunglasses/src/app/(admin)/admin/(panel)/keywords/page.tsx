import Link from "next/link";
import { listAll } from "@/lib/store";
import { clusterAction, createBriefAction, generateCandidatesAction } from "../actions";
import { ImportForm } from "./import-form";

export default async function KeywordsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const kws = await listAll("keywords");
  const articles = new Map((await listAll("articles")).map((a) => [a.id, a]));
  const groups = new Map<string, typeof kws>();
  for (const k of kws) groups.set(k.cluster || "(senza cluster)", [...(groups.get(k.cluster || "(senza cluster)") ?? []), k]);
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold">Keyword & cluster</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate">Importa un export CSV da Semrush, Ahrefs o Google Keyword Planner (colonne riconosciute: Keyword, Volume, KD/Difficulty, Intent). Il volume resta «—» finché non lo importi: i volumi non sono dati per scontati.</p>
      {sp.ok && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{sp.ok}</p>}
      {sp.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{sp.error}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm"><div><h2 className="font-display text-2xl font-semibold">0 · Genera keyword candidate dal catalogo</h2><p className="mt-1 max-w-2xl text-sm text-slate">Crea long-tail (es. «what sunglasses does X wear in Y») già mappate alla pagina giusta. <strong>Non hanno volume</strong>: scarica il CSV, incollalo in Semrush/Ahrefs (analisi bulk) e reimporta i volumi qui.</p></div>
        <div className="flex gap-3"><form action={generateCandidatesAction}><button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-champagne-text">Genera candidate</button></form><a className="rounded-full border border-ink/30 px-5 py-2 text-sm font-medium hover:bg-ink hover:text-white" href="/admin/keywords/export">Scarica CSV</a></div></div>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">1 · Importa CSV</h2><ImportForm /></div>
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-display text-2xl font-semibold">2 · Raggruppa per argomento</h2>
        <form action={clusterAction}><button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-champagne-text">Raggruppa {kws.length} keyword</button></form></div>
      <h2 className="mt-8 font-display text-2xl font-semibold">3 · Cluster e brief</h2>
      <div className="mt-3 space-y-3">
        {[...groups].sort((a, b) => b[1].length - a[1].length).map(([label, items]) => {
          const art = items.find((k) => k.articleId)?.articleId;
          return (
            <details key={label} className="rounded-2xl bg-white p-4 shadow-sm"><summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3"><span className="font-medium">{label} <span className="text-sm text-mist">· {items.length} keyword</span></span>
              {art && articles.get(art) ? <Link className="text-sm underline" href={`/admin/articles/${art}`}>Articolo: {articles.get(art)!.title}</Link> : label !== "(senza cluster)" ? null : null}</summary>
              <table className="mt-3 w-full text-left text-sm"><thead><tr className="text-xs uppercase tracking-widest text-mist"><th className="py-1">Keyword</th><th>Volume</th><th>KD</th><th>Intento</th><th>Pagina</th></tr></thead><tbody>
                {items.map((k) => <tr key={k.id} className="border-t border-line/60"><td className="py-1">{k.term}</td><td>{k.volume ?? <span title="non verificato">—</span>}</td><td>{k.difficulty ?? "—"}</td><td>{k.intent || "—"}</td><td>{k.targetUrl ? <Link className="underline" href={k.targetUrl} target="_blank">{k.targetUrl}</Link> : "—"}</td></tr>)}</tbody></table>
              {label !== "(senza cluster)" && !art && <form action={createBriefAction.bind(null, label)} className="mt-3"><button className="rounded-full border border-ink/30 px-4 py-1.5 text-xs font-medium hover:bg-ink hover:text-white">Crea brief SEO da questo cluster</button></form>}
            </details>);
        })}
        {kws.length === 0 && <p className="text-slate">Nessuna keyword.</p>}
      </div>
    </div>
  );
}
