import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

/** Standard inner-page header: breadcrumbs, single H1, optional lead + answer-first summary. */
export function PageShell({ crumbs, title, lead, answer, children, eyebrow, wide = true }: { crumbs: { name: string; path: string }[]; title: string; lead?: string; answer?: string; children: ReactNode; eyebrow?: string; wide?: boolean }) {
  return (
    <div className={`container-page py-8 md:py-12 ${wide ? "" : "max-w-3xl"}`}>
      <Breadcrumbs items={crumbs} />
      <header className="mt-4 max-w-3xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {lead && <p className="mt-2 text-base text-stone">{lead}</p>}
        {answer && <p className="mt-4 rounded-[10px] border border-line bg-white p-4 text-sm leading-relaxed" data-answer-first>{answer}</p>}
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
