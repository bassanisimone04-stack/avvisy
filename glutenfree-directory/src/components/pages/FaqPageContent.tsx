import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
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

      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">{t.faqPage.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{t.faqPage.subtitle}</p>

        <div className="mt-10 flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="mb-4 font-editorial text-xl font-semibold text-ink">{group.title}</h2>
              <FaqAccordion items={group.items} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
