import type { ContentPage } from "@/data/pages";
import { Notice } from "@/components/ui/ui";

export function ContentBody({ page, locale, translationNote }: { page: ContentPage; locale: string; translationNote: string }) {
  return (
    <div className="max-w-3xl" lang={locale !== "en" ? "en" : undefined}>
      {page.template && <div className="mb-6"><Notice tone="warning" title="Template">This is an editable template and must be reviewed by a lawyer before launch.</Notice></div>}
      {locale !== "en" && <p className="mb-4 text-xs text-stone" lang={locale}>{translationNote}</p>}
      {page.sections.map((s) => (
        <section key={s.h} className="mb-8">
          <h2 className="font-serif text-2xl">{s.h}</h2>
          {s.p.map((p, i) => <p key={i} className="mt-2 leading-relaxed">{p}</p>)}
        </section>
      ))}
    </div>
  );
}
