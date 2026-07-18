"use client";

import { useState } from "react";
import { notify } from "./Toaster";
import { IconClose, IconPlus } from "./icons";
import { categories as seedCategories } from "@/lib/mock-data";

export default function AdminCategories() {
  const [cats, setCats] = useState(
    seedCategories.map((c) => ({ name: c.name, count: c.count, active: true })),
  );
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft.trim()) return;
    setCats((p) => [...p, { name: draft.trim(), count: 0, active: true }]);
    notify(`Categoria “${draft.trim()}” aggiunta.`);
    setDraft("");
  }

  function toggle(name: string) {
    setCats((p) => p.map((c) => (c.name === name ? { ...c, active: !c.active } : c)));
  }

  function remove(name: string) {
    setCats((p) => p.filter((c) => c.name !== name));
    notify(`Categoria “${name}” rimossa.`, "info");
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-2 p-4 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nuova categoria merceologica…"
          className="field flex-1"
        />
        <button onClick={add} className="btn btn-primary btn-sm">
          <IconPlus width={16} height={16} /> Aggiungi
        </button>
      </div>

      <div className="card divide-y divide-[var(--s-line)] overflow-hidden">
        {cats.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium text-ink">{c.name}</p>
              <p className="text-xs text-muted">{c.count} lotti</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(c.name)}
                className={`chip ${c.active ? "bg-brand-soft text-brand-dark" : "bg-surface-2 text-muted"}`}
              >
                {c.active ? "Attiva" : "Disattivata"}
              </button>
              <button
                onClick={() => remove(c.name)}
                className="rounded-lg p-1.5 text-muted hover:bg-danger-soft hover:text-danger"
                aria-label="Rimuovi"
              >
                <IconClose width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
