import Breadcrumbs from "@/components/Breadcrumbs";
import FaqExplorer from "@/components/FaqExplorer";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { FAQ_GROUPS_IT, FAQ_GROUPS_EN } from "@/lib/faq-page-content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";

export default function FaqPageContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const groups = locale === "en" ? FAQ_GROUPS_EN : FAQ_GROUPS_IT;
  const allFaqs = groups.flatMap((g) => g.items);

  return (
    <div className="container-page py-10">
      <JsonLd data={faqJsonLd(allFaqs)} />
      <Breadcrumbs locale={locale} items={[{ name: t.footer.faq, path: "/faq" }]} />

      <header className="relative mx-auto mt-2 max-w-4xl overflow-hidden rounded-3xl bg-[var(--gf-panel)] px-6 py-12 text-center sm:px-12 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(45,106,79,0.6),transparent_65%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(242,177,0,0.2),transparent_65%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative">
          <p className="eyebrow !text-gold">{locale === "en" ? "Help centre" : "Centro assistenza"}</p>
          <h1 className="font-editorial mt-2 text-3xl font-semibold text-white sm:text-5xl">{t.faqPage.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{t.faqPage.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-3xl">
        <FaqExplorer groups={groups} locale={locale} />
      </div>
    </div>
  );
}
