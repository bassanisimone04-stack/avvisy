import type { ContentPage } from "@/data/pages";
import { Notice } from "@/components/ui/ui";

export function ContentBody({ page: base, locale, translationNote }: { page: ContentPage; locale: string; translationNote: string }) {
  const translated = locale === "it" && base.it;
  const page = translated ? { ...base, ...base.it! } : base;
  return (
    <div className="max-w-3xl" lang={locale !== "en" && !translated ? "en" : undefined}>
      {page.template && <div className="mb-6"><Notice tone="warning" title={locale === "it" ? "Bozza" : "Template"}>{locale === "it" ? "Questa è una bozza modificabile e deve essere rivista da un legale prima del lancio." : "This is an editable template and must be reviewed by a lawyer before launch."}</Notice></div>}
      {locale !== "en" && !translated && <p className="mb-4 text-xs text-stone" lang={locale}>{translationNote}</p>}
      {page.sections.map((s) => (
        <section key={s.h} className="mb-8">
          <h2 className="font-serif text-2xl">{s.h}</h2>
          {s.p.map((p, i) => <p key={i} className="mt-2 leading-relaxed">{p}</p>)}
        </section>
      ))}
    </div>
  );
}
