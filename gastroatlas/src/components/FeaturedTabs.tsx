"use client";

import { useState, type ReactNode } from "react";
import { T, type Locale } from "@/lib/i18n";

/** Level 1/2/3 tabs. Panels are rendered on the server and swapped here. */
export function FeaturedTabs({ locale, panels }: { locale: Locale; panels: Record<1 | 2 | 3, ReactNode> }) {
  const t = T(locale);
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  return (
    <>
      <div className="row">
        {([1, 2, 3] as const).map((n) => <button key={n} type="button" data-level={n} aria-pressed={n === level} onClick={() => setLevel(n)}>{t("Level", "Livello")} {n}</button>)}
      </div>
      <div className="grid" id="featured" aria-live="polite">{panels[level]}</div>
    </>
  );
}
