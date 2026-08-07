"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import PlaceholderImage from "@/components/PlaceholderImage";

const SEED = [
  { id: "b1", title: "Promo estate: hotel gluten free in Costiera", position: "Home — Hero secondario", active: true, seed: 601 },
  { id: "b2", title: "Nuovo Prontuario AIC disponibile", position: "Sidebar Blog", active: true, seed: 602 },
  { id: "b3", title: "Corner gluten free Naturasì: -10%", position: "Home — sopra footer", active: false, seed: 603 },
];

export default function AdminBanners() {
  const [rows, setRows] = useState(SEED);

  function toggle(id: string) {
    setRows((r) => r.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione banner</h1>
          <p className="mt-1 text-ink-soft">{rows.length} banner promozionali configurati</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuovo banner</button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((b) => (
          <div key={b.id} className="card card-soft overflow-hidden">
            <PlaceholderImage seed={b.seed} ratio="aspect-[16/9]" label={b.title} />
            <div className="p-4">
              <p className="font-semibold text-ink">{b.title}</p>
              <p className="mt-1 text-xs text-muted">{b.position}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`chip ${b.active ? "chip-brand" : "chip-neutral"}`}>{b.active ? "Attivo" : "Disattivato"}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => toggle(b.id)} className="btn btn-ghost btn-sm !px-2" aria-label="Attiva/disattiva">
                    {b.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button type="button" onClick={() => setRows((r) => r.filter((x) => x.id !== b.id))} className="btn btn-ghost btn-sm !px-2 text-danger" aria-label="Elimina"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
