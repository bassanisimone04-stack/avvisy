import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageCtx } from "../../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ContentBody } from "@/features/ContentPageView";
import { MessageForm } from "@/features/forms/Forms";
import { BUSINESS } from "@/data/pages";
import { LOCALES } from "@/i18n";

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
  return buildMetadata({ locale, path: `/business/${page.slug}/`, title: page.title, description: page.lead });
}
export default async function Topic({ params }: P) {
  const { locale, dict, data, page } = await load(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.business, path: `/${locale}/business/` }, { name: page.title, path: `/${locale}/business/${page.slug}/` }]} title={page.title} lead={page.lead}>
      <div className="grid gap-10 lg:grid-cols-2">
        <ContentBody page={page} locale={locale} translationNote={dict.common.translationPending} />
        <section className="rounded-[12px] border border-line bg-white p-6" aria-labelledby="f">
          <h2 id="f" className="font-serif text-2xl">{page.form === "claim" ? "Submit a claim" : "Get in touch"}</h2>
          <div className="mt-4">
            <MessageForm kind={page.form} subjectRef={page.slug} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }}
              extra={page.form === "claim" ? [
                { name: "venue", label: "Restaurant", type: "select", options: data.restaurants.map((r) => ({ value: r.slug, label: r.name })) },
                { name: "role", label: "Your role", type: "select", options: [{ value: "owner", label: "Owner" }, { value: "manager", label: "Manager" }, { value: "agency", label: "Agency" }] },
                { name: "evidence", label: "Verification method", type: "select", options: [{ value: "email-domain", label: "Email on the venue's domain" }, { value: "document", label: "Document check" }, { value: "phone-callback", label: "Phone call-back" }] },
              ] : [{ name: "company", label: "Company" }]} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
