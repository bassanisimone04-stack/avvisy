"use client";

import { useActionState } from "react";
import { runImport, type ImportState } from "./actions";
import { IMPORT_COLUMNS } from "@/lib/csv-import";

export function Importer({ dbConfigured }: { dbConfigured: boolean }) {
  const [state, action, pending] = useActionState<ImportState, FormData>(runImport, {});
  const r = state.report;
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-3 rounded-[12px] border border-line bg-white p-5">
        <p className="text-sm text-stone">Columns: <code>{IMPORT_COLUMNS.join(", ")}</code>. <code>source_url</code> is mandatory. Imported rows are created as <strong>draft / unverified</strong>.</p>
        <label htmlFor="csvfile" className="block text-sm font-semibold">CSV file (max 2 MB)</label>
        <input id="csvfile" name="file" type="file" accept=".csv,text/csv" className="block text-sm" />
        <label htmlFor="csvtext" className="block text-sm font-semibold">…or paste CSV</label>
        <textarea id="csvtext" name="csv" rows={6} className="w-full rounded-[8px] border border-line p-2 font-mono text-xs" placeholder={`${IMPORT_COLUMNS.join(",")}\n"Example",Paris,France,48.85,2.35,french,https://example.com,"€ 95","€ 180",,EUR,https://example.com/menu`} />
        <div className="flex flex-wrap gap-2">
          <button type="submit" name="mode" value="dry" disabled={pending} className="min-h-11 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white">Dry run</button>
          <button type="submit" name="mode" value="commit" disabled={pending || !dbConfigured} className="min-h-11 rounded-[8px] border border-carmine px-4 text-sm font-semibold text-carmine disabled:opacity-50" title={dbConfigured ? undefined : "Requires the database"}>Commit as drafts</button>
        </div>
      </form>
      {state.error && <p role="alert" className="rounded-[8px] bg-blush p-3 text-sm">{state.error}</p>}
      {r && (
        <section aria-live="polite" className="space-y-4 rounded-[12px] border border-line bg-white p-5 text-sm">
          <h2 className="font-serif text-xl">Validation report</h2>
          {r.missingColumns.length > 0 && <p className="text-carmine">Missing required columns: {r.missingColumns.join(", ")}</p>}
          <p>Rows: {r.total} · valid: {r.valid} · invalid: {r.invalid.length} · duplicates: {r.duplicates.length} · possible duplicates: {r.possibleDuplicates.length} · ready to insert: {r.toInsert.length}{state.committed != null ? ` · committed: ${state.committed}` : ""}</p>
          {r.invalid.length > 0 && <div><h3 className="font-semibold">Invalid rows</h3><ul className="list-disc pl-5">{r.invalid.map((i) => <li key={i.line}>Line {i.line}: {i.errors.join("; ")}</li>)}</ul></div>}
          {[["Duplicates (skipped)", r.duplicates], ["Possible duplicates (review)", r.possibleDuplicates]].map(([title, list]) => (list as typeof r.duplicates).length > 0 && (
            <div key={title as string}><h3 className="font-semibold">{title as string}</h3><ul className="list-disc pl-5">{(list as typeof r.duplicates).map((x, i) => <li key={i}>Line {x.line} “{x.name}” ↔ “{x.match}” ({x.matchSource}) — similarity {x.nameSimilarity}, {x.distanceM} m — {x.reason}</li>)}</ul></div>
          ))}
          {r.toInsert.length > 0 && <div><h3 className="font-semibold">Will be inserted as drafts</h3><ul className="list-disc pl-5">{r.toInsert.map((x) => <li key={x.line}>Line {x.line}: {x.name} → <code>{x.slug}</code></li>)}</ul></div>}
        </section>
      )}
    </div>
  );
}
