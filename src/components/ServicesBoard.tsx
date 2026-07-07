"use client";

import { useState } from "react";
import {
  createService,
  deleteService,
  updateService,
} from "@/lib/services";
import type { Service } from "@/lib/types";

type Draft = {
  name: string;
  description: string;
  durationMin: string;
  price: string;
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  durationMin: "30",
  price: "",
};

export default function ServicesBoard({
  initialServices,
  orgId,
}: {
  initialServices: Service[];
  orgId: string;
}) {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  function openNew() {
    setEditingId(null);
    setDraft(emptyDraft);
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditingId(s.id);
    setDraft({
      name: s.name,
      description: s.description,
      durationMin: String(s.durationMin),
      price: s.price ?? "",
    });
    setShowForm(true);
  }

  async function save() {
    const name = draft.name.trim();
    if (!name) return;
    const fields = {
      name,
      description: draft.description.trim(),
      durationMin: Number(draft.durationMin) || 30,
      price: draft.price.trim() || null,
    };
    setBusy(true);
    if (editingId) {
      await updateService(editingId, fields);
      setServices((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...fields } : s))
      );
    } else {
      const { service } = await createService({ orgId, ...fields });
      const created: Service = service ?? {
        id: `srv-${Date.now().toString(36)}`,
        orgId,
        ...fields,
      };
      setServices((prev) => [...prev, created]);
    }
    setBusy(false);
    setShowForm(false);
    setDraft(emptyDraft);
    setEditingId(null);
  }

  async function remove(id: string) {
    const s = services.find((x) => x.id === id);
    if (!s || !confirm(`Eliminare il servizio "${s.name}"?`)) return;
    setBusy(true);
    await deleteService(id);
    setServices((prev) => prev.filter((x) => x.id !== id));
    setBusy(false);
  }

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servizi</h1>
          <p className="mt-1 text-sm text-muted">
            I servizi prenotabili dalla tua pagina pubblica.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openNew}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            + Aggiungi servizio
          </button>
        )}
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-card p-5">
          <p className="font-display text-lg font-bold">
            {editingId ? "Modifica servizio" : "Nuovo servizio"}
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nome</span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Es. Dichiarazione 730"
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Descrizione</span>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              rows={2}
              placeholder="Breve descrizione del servizio"
              className={field}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Durata (min)</span>
              <input
                type="number"
                min={5}
                step={5}
                value={draft.durationMin}
                onChange={(e) =>
                  setDraft({ ...draft, durationMin: e.target.value })
                }
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Prezzo (facoltativo)</span>
              <input
                type="text"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="Es. 45 € o Gratuito"
                className={field}
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!draft.name.trim() || busy}
              className="flex-1 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Salvataggio…" : editingId ? "Salva" : "Aggiungi"}
            </button>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
          Nessun servizio. Aggiungine uno per farlo comparire sulla pagina
          pubblica.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold">{s.name}</h3>
                {s.description && (
                  <p className="mt-1 text-base leading-relaxed text-muted">
                    {s.description}
                  </p>
                )}
                <p className="mt-2 font-mono text-sm text-muted">
                  {s.durationMin} min
                  {s.price ? ` · ${s.price}` : " · Gratuito"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
