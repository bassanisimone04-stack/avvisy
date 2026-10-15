"use client";
import { startTransition, useActionState } from "react";
import { importOffersAction, type OfferImportState } from "../../actions";

const init: OfferImportState = { done: false, saved: 0, rows: 0, errors: [], dryRun: false };
export function OfferImportForm() {
  const [s, act, pending] = useActionState(importOffersAction, init);
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => act(fd)); }} className="space-y-4">
      <div><label htmlFor="file" className="text-sm font-medium">File CSV</label><input id="file" name="file" type="file" accept=".csv,text/csv,text/plain" className="mt-1 block text-sm" /></div>
      <div><label htmlFor="csv" className="text-sm font-medium">…oppure incolla il contenuto</label>
        <textarea id="csv" name="csv" rows={7} placeholder={"model,merchant,price,availability,shipping,url,last_checked\nray-ban-aviator-classic-rb3025,ebay,149.50,in stock,Free,https://www.ebay.com/itm/123,2026-10-15"} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-mono text-xs" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="dry" defaultChecked /> Solo verifica (non salvare)</label>
      <button disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-champagne-text disabled:opacity-60">{pending ? "Elaboro…" : "Verifica / importa"}</button>
      {s.done && (
        <div role={s.errors.length ? "alert" : "status"} className={`rounded-lg p-4 text-sm ${s.errors.length ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {s.errors.length ? (<><p className="font-medium">{s.errors.length} errori su {s.rows} righe: nulla è stato importato.</p><ul className="mt-2 list-disc pl-5">{s.errors.slice(0, 30).map((e, i) => <li key={i}>{e.line ? `Riga ${e.line}: ` : ""}{e.message}</li>)}</ul></>)
            : s.dryRun ? <p>Verifica superata: {s.rows} righe valide. Togli la spunta «Solo verifica» per importarle.</p>
            : <p>Importate o aggiornate {s.saved} offerte. Compaiono subito nel comparatore.</p>}
        </div>
      )}
    </form>
  );
}
