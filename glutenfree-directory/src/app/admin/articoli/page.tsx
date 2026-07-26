"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { ARTICLES } from "@/lib/mock-articles";
import { formatDateIt } from "@/lib/format";

const AI_SUGGESTIONS = [
  "10 domande da fare al ristorante quando sei celiaco",
  "Farina di grano saraceno vs farina di riso: quale scegliere",
  "Celiachia e gravidanza: cosa sapere",
  "I migliori mercatini gluten free d'Italia nel 2026",
];

export default function AdminArticles() {
  const [rows, setRows] = useState(ARTICLES);

  function remove(id: string) {
    setRows((r) => r.filter((a) => a.id !== id));
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione articoli</h1>
          <p className="mt-1 text-ink-soft">{rows.length} articoli pubblicati</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuovo articolo</button>
      </div>

      <div className="card card-soft mt-5 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-ink"><Sparkles size={16} className="text-brand" /> Suggerimenti AI per nuovi articoli</h2>
        <div className="flex flex-wrap gap-2">
          {AI_SUGGESTIONS.map((s) => <span key={s} className="chip chip-brand">{s}</span>)}
        </div>
      </div>

      <div className="card card-soft mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Autore</th>
              <th className="px-4 py-3">Pubblicato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="max-w-xs truncate px-4 py-3 font-medium text-ink">{a.title}</td>
                <td className="px-4 py-3"><span className="chip chip-neutral">{a.category}</span></td>
                <td className="px-4 py-3 text-ink-soft">{a.author}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDateIt(a.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" aria-label="Modifica" className="btn btn-ghost btn-sm !px-2"><Pencil size={14} /></button>
                    <button type="button" aria-label="Elimina" onClick={() => remove(a.id)} className="btn btn-ghost btn-sm !px-2 text-danger"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
