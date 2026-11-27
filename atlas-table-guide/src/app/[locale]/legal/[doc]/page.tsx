import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageCtx } from "../../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ContentBody } from "@/features/ContentPageView";
import { LEGAL } from "@/data/pages";
import { LOCALES } from "@/i18n";

export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => LEGAL.map((d) => ({ locale, doc: d.slug })));
}
type P = { params: Promise<{ locale: string; doc: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { doc } = await params;
  const page = LEGAL.find((d) => d.slug === doc);
  if (!page) notFound();
  return { ...ctx, page };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, page } = await load(params);
  return buildMetadata({ locale, path: `/legal/${page.slug}/`, title: (locale === "it" && page.it ? page.it : page).title, description: (locale === "it" && page.it ? page.it : page).lead });
}
export default async function Legal({ params }: P) {
  const { locale, dict, page } = await load(params);
  const T = locale === "it" && page.it ? page.it : page;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.legal, path: `/${locale}/legal/privacy/` }, { name: T.title, path: `/${locale}/legal/${page.slug}/` }]} title={T.title} lead={T.lead}>
      <ContentBody page={page} locale={locale} translationNote={dict.common.translationPending} />
    </PageShell>
  );
}
