"use client";

import { useState } from "react";
import { notify } from "./Toaster";
import { IconCheck } from "./icons";

export type ModItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: { text: string; tone: "brand" | "steel" | "signal" | "danger" };
};

const toneClass: Record<string, string> = {
  brand: "bg-brand-soft text-brand-dark",
  steel: "bg-steel-soft text-steel",
  signal: "bg-signal-soft text-signal",
  danger: "bg-danger-soft text-danger",
};

export default function ModerationList({
  items,
  approveLabel = "Approva",
  rejectLabel = "Rifiuta",
  approvedLabel = "Approvato",
  rejectedLabel = "Rifiutato",
}: {
  items: ModItem[];
  approveLabel?: string;
  rejectLabel?: string;
  approvedLabel?: string;
  rejectedLabel?: string;
}) {
  const [state, setState] = useState<Record<string, "open" | "approved" | "rejected">>(
    Object.fromEntries(items.map((i) => [i.id, "open"])),
  );

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const s = state[it.id];
        return (
          <div key={it.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{it.title}</p>
                {it.badge && (
                  <span className={`chip ${toneClass[it.badge.tone]}`}>{it.badge.text}</span>
                )}
              </div>
              {it.subtitle && <p className="mt-0.5 text-sm text-muted">{it.subtitle}</p>}
              {it.meta && <p className="mt-0.5 text-xs text-muted">{it.meta}</p>}
            </div>

            {s === "open" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setState((p) => ({ ...p, [it.id]: "rejected" }));
                    notify(`${it.title}: ${rejectedLabel.toLowerCase()}.`, "info");
                  }}
                  className="btn btn-outline btn-sm text-danger"
                >
                  {rejectLabel}
                </button>
                <button
                  onClick={() => {
                    setState((p) => ({ ...p, [it.id]: "approved" }));
                    notify(`${it.title}: ${approvedLabel.toLowerCase()}.`);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  {approveLabel}
                </button>
              </div>
            ) : (
              <span
                className={`chip ${s === "approved" ? "bg-brand-soft text-brand-dark" : "bg-danger-soft text-danger"}`}
              >
                {s === "approved" ? <IconCheck width={13} height={13} /> : null}
                {s === "approved" ? approvedLabel : rejectedLabel}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
