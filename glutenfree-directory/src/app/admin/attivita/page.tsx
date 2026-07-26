"use client";

import { useState } from "react";
import { Upload, Download, Pencil, Trash2, Plus, BadgeCheck } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { BUSINESSES } from "@/lib/mock-businesses";
import { getCategoryInfo } from "@/lib/categories";

export default function AdminBusinesses() {
  const [rows, setRows] = useState(BUSINESSES.map((b) => ({ ...b, status: "Pubblicata" as "Pubblicata" | "In revisione" })));
  const [query, setQuery] = useState("");

  const filtered = rows.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.city.toLowerCase().includes(query.toLowerCase()));

  function remove(id: string) {
    setRows((r) => r.filter((b) => b.id !== id));
  }

  function toggleStatus(id: string) {
    setRows((r) => r.map((b) => (b.id === id ? { ...b, status: b.status === "Pubblicata" ? "In revisione" : "Pubblicata" } : b)));
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione attività</h1>
          <p className="mt-1 text-ink-soft">{rows.length} attività nella directory</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline btn-sm"><Upload size={14} /> Import CSV</button>
          <button type="button" className="btn btn-outline btn-sm"><Download size={14} /> Esporta dati</button>
          <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuova attività</button>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca per nome o città…"
        className="field mt-5 max-w-sm"
      />

      <div className="card card-soft mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Città</th>
              <th className="px-4 py-3">Voto</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-ink">
                  <span className="flex items-center gap-1.5">{b.name} {b.aicCertified && <BadgeCheck size={13} className="text-brand" />}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{getCategoryInfo(b.category)?.label}</td>
                <td className="px-4 py-3 text-ink-soft">{b.city}</td>
                <td className="px-4 py-3 text-ink-soft">{b.rating}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleStatus(b.id)} className={`chip ${b.status === "Pubblicata" ? "chip-brand" : "chip-gold"}`}>{b.status}</button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" aria-label="Modifica" className="btn btn-ghost btn-sm !px-2"><Pencil size={14} /></button>
                    <button type="button" aria-label="Elimina" onClick={() => remove(b.id)} className="btn btn-ghost btn-sm !px-2 text-danger"><Trash2 size={14} /></button>
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
