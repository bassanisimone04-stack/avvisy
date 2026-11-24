"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/types";

/** Evidenzia nel testo le parole cercate (senza dipendere da accenti e maiuscole). */
function highlight(text: string, query: string): ReactNode {
  const words = query
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (words.length === 0) return text;
  // Il testo senza accenti ha la stessa lunghezza dell'originale (NFD si scompone e si ricompone carattere per carattere).
  const flat = text
    .split("")
    .map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "")[0] ?? c)
    .join("")
    .toLowerCase();
  const marks: [number, number][] = [];
  for (const w of words) {
    let from = 0;
    for (;;) {
      const at = flat.indexOf(w, from);
      if (at === -1) break;
      marks.push([at, at + w.length]);
      from = at + w.length;
    }
  }
  if (marks.length === 0) return text;
  marks.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const m of marks) {
    const last = merged[merged.length - 1];
    if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]);
    else merged.push([...m] as [number, number]);
  }
  const out: ReactNode[] = [];
  let pos = 0;
  merged.forEach(([s, e], i) => {
    if (s > pos) out.push(text.slice(pos, s));
    out.push(
      <mark key={i} className="rounded bg-[var(--gf-gold-soft)] px-0.5 text-ink">
        {text.slice(s, e)}
      </mark>,
    );
    pos = e;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

/**
 * Domande e risposte a schede numerate. Si possono aprire più domande insieme;
 * `openAll` le apre o le chiude tutte dall'esterno, `query` evidenzia le parole cercate.
 */
export default function FaqAccordion({
  items,
  defaultOpen = 0,
  openAll,
  query = "",
  startAt = 1,
}: {
  items: FaqItem[];
  /** Indice della domanda aperta all'inizio (null = tutte chiuse). */
  defaultOpen?: number | null;
  /** Cambiando da un valore all'altro apre (true) o chiude (false) tutte le domande. */
  openAll?: boolean;
  query?: string;
  startAt?: number;
}) {
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen === null ? [] : [defaultOpen]));

  // "Apri tutte" / "Chiudi tutte" dall'esterno: dopo, ogni domanda resta apribile e chiudibile da sola.
  useEffect(() => {
    if (openAll === undefined) return;
    setOpen(openAll ? new Set(items.map((_, i) => i)) : new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAll]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${uid}-p${i}`;
        const btnId = `${uid}-b${i}`;
        return (
          <div
            key={item.question}
            className={`group overflow-hidden rounded-2xl border bg-surface transition-all duration-200 ${
              isOpen
                ? "border-brand/30 shadow-[0_10px_30px_-18px_rgba(18,43,32,0.45)]"
                : "border-line hover:border-line-strong hover:shadow-[0_6px_20px_-16px_rgba(18,43,32,0.4)]"
            }`}
          >
            <h3>
              <button
                type="button"
                id={btnId}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5 sm:py-[18px]"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors ${
                    isOpen ? "bg-brand-solid text-white" : "bg-brand-soft text-brand-dark"
                  }`}
                >
                  {String(startAt + i).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 pt-1 text-[15px] font-semibold leading-snug text-ink sm:text-base">
                  {highlight(item.question, query)}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-brand transition-all duration-200 ${
                    isOpen ? "rotate-45 border-brand/30 bg-brand-soft" : "group-hover:bg-surface-2"
                  }`}
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mx-4 mb-4 border-t border-line pt-4 sm:mx-5 sm:mb-5 sm:pl-12">
                  <p className="text-[15px] leading-relaxed text-ink-soft">{highlight(item.answer, query)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
