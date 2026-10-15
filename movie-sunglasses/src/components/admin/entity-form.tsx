"use client";
import { startTransition, useActionState } from "react";
import type { Field } from "@/lib/admin/entities";

export interface FormState { error: string }
type Opt = [string, string];
const cls = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

export function EntityForm({ fields, values, refs, action, submitLabel }: {
  fields: Field[]; values: Record<string, unknown>; refs: Record<string, Opt[]>;
  action: (prev: FormState, form: FormData) => Promise<FormState>; submitLabel: string;
}) {
  const [state, act, pending] = useActionState(action, { error: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => act(fd)); }} className="space-y-5">
      {fields.map((f) => {
        const v = values[f.name];
        const id = `f-${f.name}`;
        const label = <label htmlFor={id} className="text-sm font-medium">{f.label}{f.required && <span className="text-red-700"> *</span>}</label>;
        const help = f.help ? <p className="mt-1 text-xs text-slate">{f.help}</p> : null;
        if (f.type === "boolean") return <div key={f.name}><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" name={f.name} defaultChecked={Boolean(v)} className="h-4 w-4" />{f.label}</label>{help}</div>;
        if (f.type === "textarea" || f.type === "pairs")
          return <div key={f.name}>{label}<textarea id={id} name={f.name} rows={f.rows ?? 4} defaultValue={String(v ?? "")} className={`${cls} ${f.name === "body" ? "font-mono" : ""}`} />{help}</div>;
        if (f.type === "select" || f.type === "ref") {
          const opts = f.type === "ref" ? refs[f.name] ?? [] : f.options ?? [];
          return <div key={f.name}>{label}<select id={id} name={f.name} defaultValue={String(v ?? "")} className={cls}>{!f.required || f.type === "ref" ? <option value="">{f.required ? "— scegli —" : "—"}</option> : null}{opts.map(([val, l]) => <option key={val} value={val}>{l}</option>)}</select>{help}</div>;
        }
        if (f.type === "refs") {
          const sel = new Set((v as string[] | undefined) ?? []);
          return <fieldset key={f.name}><legend className="text-sm font-medium">{f.label}</legend><div className="mt-1 grid max-h-48 grid-cols-1 gap-1 overflow-auto rounded-lg border border-line bg-white p-3 text-sm sm:grid-cols-2">
            {(refs[f.name] ?? []).map(([val, l]) => <label key={val} className="flex items-center gap-2"><input type="checkbox" name={f.name} value={val} defaultChecked={sel.has(val)} />{l}</label>)}</div>{help}</fieldset>;
        }
        const type = f.type === "number" ? "text" : f.type === "datetime" ? "datetime-local" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text";
        return <div key={f.name}>{label}<input id={id} name={f.name} type={type} inputMode={f.type === "number" ? "decimal" : undefined} defaultValue={String(v ?? "")} required={f.required && f.type !== "number"} placeholder={f.placeholder} className={cls} />{f.type === "datetime" && <p className="mt-1 text-xs text-slate">Orario UTC.</p>}{help}</div>;
      })}
      {state.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-champagne-text disabled:opacity-60">{pending ? "Salvataggio…" : submitLabel}</button>
    </form>
  );
}
