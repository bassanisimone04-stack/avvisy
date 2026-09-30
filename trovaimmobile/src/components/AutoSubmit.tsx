"use client";

import type { SelectHTMLAttributes } from "react";

/** <select> che invia il form al cambio (filtri a cascata regione → città → quartiere). */
export function AutoSubmitSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}

/** Filtri chiusi di default su smartphone (i risultati restano in vista), aperti su desktop. */
export function FiltersDetails({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details
      ref={(el) => {
        if (el && !el.dataset.init) {
          el.dataset.init = "1";
          if (window.matchMedia("(min-width: 960px)").matches) el.open = true;
        }
      }}
    >
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
