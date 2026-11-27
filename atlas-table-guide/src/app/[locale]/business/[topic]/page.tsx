import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageCtx } from "../../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ContentBody } from "@/features/ContentPageView";
import { MessageForm } from "@/features/forms/Forms";
import { BUSINESS } from "@/data/pages";
import { LOCALES, tx } from "@/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => BUSINESS.map((b) => ({ locale, topic: b.slug })));
}
type P = { params: Promise<{ locale: string; topic: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { topic } = await params;
  const page = BUSINESS.find((b) => b.slug === topic);
  if (!page) notFound();
  return { ...ctx, page };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, page } = await load(params);
  return buildMetadata({ locale, path: `/business/${page.slug}/`, title: (locale === "it" && page.it ? page.it : page).title, description: (locale === "it" && page.it ? page.it : page).lead });
}
export default async function Topic({ params }: P) {
  const { locale, dict, data, page } = await load(params);
  const T = locale === "it" && page.it ? page.it : page;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.business, path: `/${locale}/business/` }, { name: T.title, path: `/${locale}/business/${page.slug}/` }]} title={T.title} lead={T.lead}>
      <div className="grid gap-10 lg:grid-cols-2">
        <ContentBody page={page} locale={locale} translationNote={dict.common.translationPending} />
        <section className="rounded-[12px] border border-line bg-white p-6" aria-labelledby="f">
          <h2 id="f" className="font-serif text-2xl">{page.form === "claim" ? tx(locale, "Submit a claim", "Invia una rivendicazione") : tx(locale, "Get in touch", "Contattaci")}</h2>
          <div className="mt-4">
            <MessageForm kind={page.form} subjectRef={page.slug} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }}
              extra={page.form === "claim" ? [
                { name: "venue", label: tx(locale, "Restaurant", "Ristorante"), type: "select", options: data.restaurants.map((r) => ({ value: r.slug, label: r.name })) },
                { name: "role", label: tx(locale, "Your role", "Il tuo ruolo"), type: "select", options: [{ value: "owner", label: tx(locale, "Owner", "Proprietario") }, { value: "manager", label: tx(locale, "Manager", "Responsabile") }, { value: "agency", label: tx(locale, "Agency", "Agenzia") }] },
                { name: "evidence", label: tx(locale, "Verification method", "Metodo di verifica"), type: "select", options: [{ value: "email-domain", label: tx(locale, "Email on the venue's domain", "Email sul dominio del locale") }, { value: "document", label: tx(locale, "Document check", "Controllo di un documento") }, { value: "phone-callback", label: tx(locale, "Phone call-back", "Richiamata telefonica") }] },
              ] : [{ name: "company", label: tx(locale, "Company", "Azienda") }]} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
