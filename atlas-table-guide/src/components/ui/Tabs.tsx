"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

/** WAI-ARIA tabs (automatic activation, arrow/Home/End keys). Panels are server-rendered children. */
export function Tabs({ tabs, label }: { tabs: { id: string; label: string; panel: ReactNode }[]; label: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = (i: number) => { const n = (i + tabs.length) % tabs.length; setActive(n); refs.current[n]?.focus(); };
  return (
    <div>
      <div role="tablist" aria-label={label} className="mb-6 flex gap-1 border-b border-line">
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`${base}-t-${i}`} aria-selected={i === active} aria-controls={`${base}-p-${i}`} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => { if (e.key === "ArrowRight") focus(i + 1); else if (e.key === "ArrowLeft") focus(i - 1); else if (e.key === "Home") focus(0); else if (e.key === "End") focus(tabs.length - 1); }}
            className={clsx("-mb-px min-h-11 border-b-2 px-4 text-sm font-semibold", i === active ? "border-carmine text-carmine" : "border-transparent text-stone hover:text-ink")}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${base}-p-${i}`} aria-labelledby={`${base}-t-${i}`} hidden={i !== active} tabIndex={0}>{t.panel}</div>
      ))}
    </div>
  );
}
