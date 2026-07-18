"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconClose } from "./icons";

type Toast = { id: number; message: string; tone: "success" | "info" };

// notify() può essere chiamato da qualsiasi client component per mostrare
// una notifica simulata.
export function notify(message: string, tone: "success" | "info" = "success") {
  window.dispatchEvent(
    new CustomEvent("scortvia:toast", { detail: { message, tone } }),
  );
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; tone: Toast["tone"] };
      const id = ++counter;
      setToasts((t) => [...t, { id, ...detail }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    };
    window.addEventListener("scortvia:toast", handler);
    return () => window.removeEventListener("scortvia:toast", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-[var(--shadow-lift)]"
        >
          <span
            className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              t.tone === "success"
                ? "bg-brand-soft text-brand-dark"
                : "bg-steel-soft text-steel"
            }`}
          >
            <IconCheck width={15} height={15} />
          </span>
          <p className="flex-1 text-sm text-ink">{t.message}</p>
          <button
            onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
            className="text-muted hover:text-ink"
            aria-label="Chiudi notifica"
          >
            <IconClose width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
