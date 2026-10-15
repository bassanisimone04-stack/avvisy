import Link from "next/link";
import { notFound } from "next/navigation";
import { listAll } from "@/lib/store";
import { getCatalog } from "@/lib/catalog";
import { entityByKey } from "@/lib/admin/entities";
import { serializeValues, refOptions } from "@/lib/admin/form-helpers";
import { EntityForm } from "@/components/admin/entity-form";
import { aiInfo } from "@/lib/ai";
import { buildFacts, linkTargets, suggestLinks, suggestMeta, suggestModels } from "@/lib/editorial";
import { CLAIM_LABEL, checkClaims } from "@/lib/claims";
import { applyLinkAction, applyMetaAction, applyModelsAction, generateDraftAction, markForUpdateAction, saveEntityAction } from "../../actions";

type Row = Record<string, unknown>;
const btn = "rounded-full border border-ink/30 px-4 py-1.5 text-xs font-medium hover:bg-ink hover:text-white";

export default async function ArticleEditor({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const cfg = entityByKey("articles")!;
  const isNew = id === "new";
  const a = isNew ? undefined : (await listAll("articles")).find((x) => x.id === id);
  if (!isNew && !a) notFound();
  const defaults = { status: "brief", category: "Guides" };
  const form = (
    <EntityForm fields={cfg.fields} values={serializeValues(cfg.fields, a as unknown as Row | undefined, defaults)} refs={await refOptions(cfg.fields)} action={saveEntityAction.bind(null, "articles", isNew ? null : id)} submitLabel={isNew ? "Crea articolo" : "Salva"} />
  );
  if (!a) return <div className="max-w-3xl"><p className="text-sm"><Link className="underline" href="/admin/articles">← Articoli</Link></p><h1 className="mt-2 font-display text-4xl font-semibold">Nuovo articolo</h1><div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">{form}</div></div>;

  const c = await getCatalog();
  const ai = aiInfo();
  const facts = buildFacts(c, a);
  const offerPrices = c.offers.map((o) => o.price).filter((p): p is number => p != null);
  const sources = a.sources.map((s) => `${s.title} ${s.url}`).join("\n");
  const flags = a.body ? checkClaims(a.body + "\n" + a.answer + "\n" + a.faq.map((f) => f.a).join("\n"), facts + "\n" + sources + "\n" + c.models.map((m) => m.name + " " + (m.modelCode ?? "")).join("\n"), { allowedPrices: offerPrices }) : [];
  const meta = suggestMeta(a);
  const links = suggestLinks(a.body, linkTargets(c), `/blog/${a.slug}`).slice(0, 12);
  const models = suggestModels(c, a);
  const lens = { t: a.metaTitle.length, d: a.metaDescription.length };
  return (
    <div className="max-w-6xl">
      <p className="text-sm"><Link className="underline" href="/admin/articles">← Articoli</Link></p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3"><h1 className="font-display text-4xl font-semibold">{a.title}</h1>
        <span className="rounded-full bg-ink px-3 py-1 text-xs uppercase tracking-widest text-white">{a.status}{a.aiGenerated ? " · AI" : ""}{a.reviewed ? " · revisionato" : " · da revisionare"}</span></div>
      {sp.saved && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">Salvato.</p>}
      {sp.ok && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{sp.ok}</p>}
      {sp.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{sp.error}</p>}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">{form}</div>
        <div className="space-y-5 text-sm">
          <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Bozza con AI</h2>
            <p className="mt-2 text-slate">Usa solo i fatti verificati dei modelli e dei film collegati ({facts ? facts.split("\n").length : 0} righe di fatti). Il risultato resta bozza e richiede revisione umana.</p>
            <p className="mt-2 text-xs text-mist">Provider: {ai.provider} · modello: {ai.model} · {ai.configured ? "configurato" : "NON configurato (imposta AI_API_KEY)"}</p>
            <form action={generateDraftAction.bind(null, a.id)} className="mt-3"><button disabled={!ai.configured || !facts} className={`${btn} disabled:opacity-40`}>{a.status === "published" ? "Genera aggiornamento (nuova bozza)" : "Genera bozza"}</button></form>
            {!facts && <p className="mt-2 text-xs text-red-700">Collega prima almeno un modello o un film.</p>}
            <form action={markForUpdateAction.bind(null, a.id)} className="mt-3"><button className={btn}>Segna da aggiornare (ritira dal sito)</button></form></section>

          <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Controllo informazioni non verificate</h2>
            <p className="mt-1 text-xs text-slate">Segnala anni, prezzi, codici, percentuali, superlativi, citazioni e attribuzioni non presenti nei fatti verificati. È un aiuto euristico, non sostituisce la revisione.</p>
            {flags.length === 0 ? <p className="mt-3 text-green-800">Nessuna affermazione specifica fuori dai fatti verificati.</p> :
              <ul className="mt-3 max-h-80 space-y-2 overflow-auto">{flags.map((f, i) => <li key={i} className="rounded-lg bg-amber-50 p-2"><p className="font-medium">{CLAIM_LABEL[f.kind]}: <mark className="bg-amber-200">{f.text}</mark></p><p className="text-xs text-slate">{f.sentence}</p></li>)}</ul>}</section>

          <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Meta title e description</h2>
            <p className="mt-1 text-xs text-slate">Attuali: title {lens.t}/60, description {lens.d}/155.</p>
            <form action={applyMetaAction.bind(null, a.id)} className="mt-3 space-y-3">
              <fieldset><legend className="text-xs font-medium uppercase tracking-widest text-mist">Title</legend>{meta.titles.map((t, i) => <label key={i} className="mt-1 flex items-start gap-2"><input type="radio" name="title" value={i} defaultChecked={i === 0} className="mt-1" /><span>{t} <span className="text-xs text-mist">({t.length})</span></span></label>)}</fieldset>
              <fieldset><legend className="text-xs font-medium uppercase tracking-widest text-mist">Description</legend>{meta.descriptions.map((t, i) => <label key={i} className="mt-1 flex items-start gap-2"><input type="radio" name="desc" value={i} defaultChecked={i === 0} className="mt-1" /><span>{t} <span className="text-xs text-mist">({t.length})</span></span></label>)}</fieldset>
              <button className={btn}>Applica selezione</button></form></section>

          <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Link interni suggeriti</h2>
            {links.length === 0 ? <p className="mt-2 text-slate">Nessuna menzione senza link.</p> : <ul className="mt-3 space-y-2">{links.map((l) => <li key={l.href} className="flex items-center justify-between gap-2"><span>{l.name} <span className="text-xs text-mist">→ {l.type}</span></span><form action={applyLinkAction.bind(null, a.id, l.name, l.href)}><button className={btn}>Inserisci</button></form></li>)}</ul>}</section>

          <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-display text-2xl font-semibold">Prodotti pertinenti</h2>
            {models.length === 0 ? <p className="mt-2 text-slate">Nessun altro modello suggerito.</p> :
              <form action={applyModelsAction.bind(null, a.id)} className="mt-3 space-y-1">{models.map((m) => <label key={m.id} className="flex items-center gap-2"><input type="checkbox" name="model" value={m.id} defaultChecked />{m.name}</label>)}<button className={`${btn} mt-3`}>Collega selezionati</button></form>}</section>
        </div>
      </div>
    </div>
  );
}
