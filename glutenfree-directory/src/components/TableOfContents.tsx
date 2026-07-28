"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/types";
import { List } from "lucide-react";
import { useDictionary } from "@/lib/i18n/useLocale";

export default function TableOfContents({ headings, accent, sticky = true, hideTitle = false }: { headings: ArticleHeading[]; accent?: string; sticky?: boolean; hideTitle?: boolean }) {
  const { t } = useDictionary();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={t.blog.tocTitle} className={`card card-soft p-5 ${sticky ? "sticky top-24" : ""}`}>
      {!hideTitle && (
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <List size={16} style={{ color: accent }} />
          {t.blog.tocTitle}
        </div>
      )}
      <ul className="space-y-2 text-sm">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${h.id}`}
                className={`block border-l-2 pl-2.5 -ml-px transition-colors ${active ? "font-semibold" : "border-transparent text-ink-soft hover:text-ink"}`}
                style={active ? { color: accent, borderColor: accent } : undefined}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
