"use client";

import type { ArticleHeading } from "@/lib/types";
import { List } from "lucide-react";
import { useDictionary } from "@/lib/i18n/useLocale";

export default function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  const { t } = useDictionary();
  if (headings.length === 0) return null;
  return (
    <nav aria-label={t.blog.tocTitle} className="card card-soft p-5 sticky top-24">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <List size={16} className="text-brand" />
        {t.blog.tocTitle}
      </div>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a href={`#${h.id}`} className="text-ink-soft hover:text-brand-dark link-underline">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
