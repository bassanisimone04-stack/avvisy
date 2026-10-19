import Link from "next/link";
import { notFound } from "next/navigation";
import { listAll } from "@/lib/store";
import { entityByKey, rowLabel } from "@/lib/admin/entities";
import type { CollectionName } from "@/lib/types";
import { deleteEntityAction } from "../actions";

const SIZE = 25;
type Row = Record<string, unknown>;

export default async function EntityList({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { entity } = await params;
  const sp = await searchParams;
  const cfg = entityByKey(entity);
  if (!cfg) notFound();
  const rows = (await listAll(cfg.key)) as unknown as Row[];
  const q = (sp.q ?? "").toLowerCase();
  const filtered = q ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : rows;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pages = Math.max(1, Math.ceil(filtered.length / SIZE));
  const slice = filtered.slice((page - 1) * SIZE, page * SIZE);
  // resolve ref columns to readable labels
  const lookups = new Map<CollectionName, Map<string, string>>();
  for (const f of cfg.fields) if (f.type === "ref" && f.ref && cfg.columns.includes(f.name)) lookups.set(f.ref, new Map(((await listAll(f.ref)) as unknown as Row[]).map((r) => [String(r.id), rowLabel(f.ref!, r)])));
  const show = (name: string, v: unknown) => {
    const f = cfg.fields.find((x) => x.name === name);
    if (f?.type === "ref" && f.ref) return lookups.get(f.ref)?.get(String(v)) ?? String(v ?? "—");
    if (typeof v === "boolean") return v ? "✓" : "—";
    if (v == null || v === "") return "—";
    return String(v);
  };
  const head = (n: string) => cfg.fields.find((f) => f.name === n)?.label ?? (n === "at" ? "Data" : n === "updatedAt" ? "Aggiornato" : n);
  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-4xl font-semibold">{cfg.label}</h1>{cfg.help && <p className="mt-2 max-w-2xl text-sm text-slate">{cfg.help}</p>}</div>
        {!cfg.noCreate && <Link href={`/admin/${cfg.key}/new`} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">+ Nuovo</Link>}</div>
      {sp.saved && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">Salvato.</p>}
      {sp.deleted && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">Eliminato.</p>}
      {sp.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{sp.error}</p>}
      <form method="get" className="mt-5"><label className="sr-only" htmlFor="q">Cerca</label><input id="q" name="q" defaultValue={sp.q} placeholder="Cerca…" className="w-full max-w-sm rounded-full border border-line bg-white px-4 py-2 text-sm" /></form>
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-widest text-mist">{cfg.columns.map((c) => <th key={c} className="px-4 py-3 font-medium">{head(c)}</th>)}<th className="px-4 py-3"><span className="sr-only">Azioni</span></th></tr></thead>
          <tbody>{slice.map((r) => (
            <tr key={String(r.id)} className="border-b border-line/60 last:border-0 hover:bg-paper">
              {cfg.columns.map((c, i) => <td key={c} className="max-w-xs truncate px-4 py-3">{i === 0 ? <Link className="font-medium underline-offset-4 hover:underline" href={cfg.key === "articles" ? `/admin/articles/${r.id}` : `/admin/${cfg.key}/${r.id}`}>{show(c, r[c])}</Link> : show(c, r[c])}</td>)}
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {cfg.publicPath && <Link className="mr-3 text-xs underline" target="_blank" href={cfg.publicPath(r)}>Vedi</Link>}
                <form action={deleteEntityAction.bind(null, cfg.key, String(r.id))} className="inline"><button className="text-xs text-red-700 underline" aria-label={`Elimina ${show(cfg.columns[0], r[cfg.columns[0]])}`}>Elimina</button></form>
              </td></tr>))}
            {slice.length === 0 && <tr><td className="px-4 py-8 text-center text-slate" colSpan={cfg.columns.length + 1}>Nessun elemento.</td></tr>}
          </tbody></table></div>
      <div className="mt-4 flex items-center gap-3 text-sm"><span>{filtered.length} elementi</span>{page > 1 && <Link className="underline" href={`/admin/${cfg.key}?page=${page - 1}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`}>← Precedente</Link>}{page < pages && <Link className="underline" href={`/admin/${cfg.key}?page=${page + 1}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`}>Successiva →</Link>}</div>
    </div>
  );
}
