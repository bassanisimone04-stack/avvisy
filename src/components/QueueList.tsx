"use client";

import { useState } from "react";
import type { QueueEntry } from "@/lib/types";
import { getServiceById } from "@/lib/mock-data";
import { cn, queueStatusLabel } from "@/lib/utils";

type Props = {
  initialEntries: QueueEntry[];
  /** Mostra i controlli operatore (Chiama, Completa, Salta). */
  interactive?: boolean;
};

/** Minuti di attesa stimati per chi è in coda, in base alla durata dei servizi. */
function estimatedWait(waiting: QueueEntry[]) {
  return waiting.reduce(
    (min, e) => min + (getServiceById(e.serviceId)?.durationMin ?? 15),
    0
  );
}

export default function QueueList({ initialEntries, interactive }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [servedCount, setServedCount] = useState(0);
  const [lastServed, setLastServed] = useState<string | null>(null);

  const serving = entries.find((e) => e.status === "in-servizio") ?? null;
  const waiting = entries.filter((e) => e.status !== "in-servizio");

  /** Promuove il primo in attesa a "in servizio". */
  function promoteFirst(list: QueueEntry[]): QueueEntry[] {
    let promoted = false;
    return list.map((e) => {
      if (!promoted && e.status !== "in-servizio") {
        promoted = true;
        return { ...e, status: "in-servizio" as const };
      }
      return e;
    });
  }

  /** Nessuno allo sportello: chiama il primo in attesa. */
  function callNext() {
    setEntries((prev) => promoteFirst(prev));
  }

  /** Sportello libero: chiude chi è in servizio e chiama automaticamente il prossimo. */
  function complete() {
    if (!serving) return;
    setLastServed(serving.ticket);
    setServedCount((c) => c + 1);
    setEntries((prev) =>
      promoteFirst(prev.filter((e) => e.id !== serving.id))
    );
  }

  /** Cliente assente: rimanda in fondo alla coda e chiama il prossimo. */
  function skip() {
    if (!serving) return;
    setEntries((prev) => {
      const rest = promoteFirst(prev.filter((e) => e.id !== serving.id));
      return [...rest, { ...serving, status: "in-attesa" as const }];
    });
  }

  const wait = estimatedWait(waiting);

  return (
    <div className="flex flex-col gap-4">
      {/* Contatori in tempo reale */}
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "In servizio", value: serving?.ticket ?? "—", accent: true },
          { label: "In attesa", value: String(waiting.length) },
          { label: "Serviti oggi", value: String(servedCount) },
          {
            label: "Attesa stimata",
            value: waiting.length ? `~${wait}′` : "0′",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-card p-3"
          >
            <dt className="text-xs font-medium text-muted">{stat.label}</dt>
            <dd
              className={cn(
                "mt-0.5 font-mono text-2xl font-bold tracking-tight",
                stat.accent ? "text-signal" : "text-ink"
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
          La coda è vuota. I prossimi check-in appariranno qui in tempo reale.
        </div>
      ) : (
        <>
          {/* Ora in servizio */}
          {serving ? (
            <div className="ticket flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={skip}
                    className="rounded-full border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Salta
                  </button>
                  <button
                    type="button"
                    onClick={complete}
                    className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Completa e chiama
                  </button>
                </div>
              )}
            </div>
          ) : (
            interactive &&
            waiting.length > 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-card p-6 text-center">
                <p className="text-sm text-muted">
                  Sportello libero. Chiama il prossimo in coda.
                </p>
                <button
                  type="button"
                  onClick={callNext}
                  className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Chiama il prossimo
                </button>
              </div>
            )
          )}

          {/* Ultimo numero servito */}
          {lastServed && (
            <p className="text-center text-xs text-muted">
              Ultimo completato:{" "}
              <span className="font-mono font-semibold text-ink">
                {lastServed}
              </span>
            </p>
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
        </>
      )}
    </div>
  );
}
