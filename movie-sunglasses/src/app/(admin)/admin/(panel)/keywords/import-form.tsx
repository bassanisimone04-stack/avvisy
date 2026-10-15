"use client";
import { useActionState } from "react";
import { importKeywordsAction } from "../actions";

export function ImportForm() {
  const [state, action, pending] = useActionState(importKeywordsAction, { msg: "", error: false });
  return (
    <form action={action} className="mt-3 space-y-3">
      <div><label htmlFor="file" className="text-sm font-medium">File CSV</label><input id="file" name="file" type="file" accept=".csv,text/csv,text/plain" className="mt-1 block text-sm" /></div>
      <div><label htmlFor="csv" className="text-sm font-medium">…oppure incolla il contenuto</label><textarea id="csv" name="csv" rows={5} placeholder={"Keyword,Volume,KD\ntop gun sunglasses,,"} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-mono text-sm" /></div>
      <div><label htmlFor="source" className="text-sm font-medium">Fonte del dato</label><input id="source" name="source" placeholder="es. Semrush US, 2026-10" className="mt-1 w-full max-w-sm rounded-lg border border-line px-3 py-2 text-sm" /></div>
      {state.msg && <p role={state.error ? "alert" : "status"} className={`text-sm ${state.error ? "text-red-700" : "text-green-800"}`}>{state.msg}</p>}
      <button disabled={pending} className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-champagne-text disabled:opacity-60">{pending ? "Importo…" : "Importa"}</button>
    </form>
  );
}
