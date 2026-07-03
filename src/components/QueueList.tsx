"use client";

import { useState } from "react";
import type { QueueEntry } from "@/lib/types";
import { getServiceById } from "@/lib/mock-data";
import { queueStatusLabel } from "@/lib/utils";

type Props = {
  initialEntries: QueueEntry[];
  /** Mostra i controlli operatore (Chiama il prossimo, Completa). */
  interactive?: boolean;
};

export default function QueueList({ initialEntries, interactive }: Props) {
  const [entries, setEntries] = useState(initialEntries);

  const serving = entries.find((e) => e.status === "in-servizio") ?? null;
  const waiting = entries.filter((e) => e.status !== "in-servizio");

  function callNext() {
    setEntries((prev) => {
      const next = prev.filter((e) => e.status !== "in-servizio");
      if (next.length === 0) return [];
      return next.map((e, i) => (i === 0 ? { ...e, status: "in-servizio" } : e));
    });
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
        La coda è vuota. I prossimi check-in appariranno qui in tempo reale.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ora in servizio */}
      {serving && (
        <div className="ticket flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Ora in servizio
            </p>
            <p className="font-mono text-5xl font-bold text-signal">
              {serving.ticket}
            </p>
            <p className="mt-1 text-sm text-muted">
              {serving.customerName} ·{" "}
              {getServiceById(serving.serviceId)?.name ?? "—"}
            </p>
          </div>
          {interactive && (
            <button
              type="button"
              onClick={callNext}
              className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Chiama il prossimo
            </button>
          )}
        </div>
      )}

      {/* In attesa */}
      <ol className="flex flex-col gap-2">
        {waiting.map((entry, i) => (
          <li
            key={entry.id}
            className="flex items-center gap-4 rounded-xl border border-line bg-card p-4"
          >
            <span className="w-16 shrink-0 font-mono text-xl font-bold">
              {entry.ticket}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {entry.customerName}
              </p>
              <p className="truncate text-xs text-muted">
                {getServiceById(entry.serviceId)?.name ?? "—"} · arrivo{" "}
                {entry.joinedAt}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted">
              {entry.status === "chiamato"
                ? queueStatusLabel[entry.status]
                : `${i + 1}° in fila`}
            </span>
          </li>
        ))}
        {waiting.length === 0 && (
          <li className="rounded-xl border border-dashed border-line bg-card p-6 text-center text-sm text-muted">
            Nessuno in attesa.
          </li>
        )}
      </ol>
    </div>
  );
}
