import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { MessageForm } from "@/features/forms/Forms";
import { BRAND } from "@/config/brand";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ topic?: string; ref?: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/contact/", title: dict.footer.contact, description: `Contact ${BRAND.shortName}: questions, corrections and partnerships.` });
}
export default async function Contact({ params, searchParams }: P) {
  const { locale, dict } = await pageCtx(params);
  const sp = await searchParams;
  const correction = sp.topic === "correction";
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.contact, path: `/${locale}/contact/` }]} title={correction ? dict.footer.report : dict.footer.contact} lead={`${BRAND.supportEmail}`} wide={false}>
      <MessageForm kind={correction ? "correction" : "contact"} subjectRef={sp.ref?.slice(0, 120)} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} messageLabel={correction ? dict.forms.field : undefined}
        extra={correction ? [{ name: "page_url", label: "Page or venue concerned" }] : undefined} />
    </PageShell>
  );
}
