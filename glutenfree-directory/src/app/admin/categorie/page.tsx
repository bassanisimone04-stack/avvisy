"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import CategoryIcon from "@/components/CategoryIcon";
import { CATEGORIES } from "@/lib/categories";
import { BUSINESSES } from "@/lib/mock-businesses";

export default function AdminCategories() {
  const [rows, setRows] = useState(CATEGORIES);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione categorie</h1>
          <p className="mt-1 text-ink-soft">{rows.length} categorie di attività attive</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuova categoria</button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) => (
          <div key={c.slug} className="card card-soft flex items-start gap-3 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><CategoryIcon icon={c.icon} size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{c.labelPlural}</p>
              <p className="mt-0.5 text-xs text-muted">{BUSINESSES.filter((b) => b.category === c.slug).length} attività</p>
              <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" className="btn btn-ghost btn-sm !px-2" aria-label="Modifica"><Pencil size={14} /></button>
              <button type="button" onClick={() => setRows((r) => r.filter((x) => x.slug !== c.slug))} className="btn btn-ghost btn-sm !px-2 text-danger" aria-label="Elimina"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
