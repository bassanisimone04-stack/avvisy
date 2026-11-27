import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ContentBody } from "@/features/ContentPageView";
import { STATIC } from "@/data/pages";

export const revalidate = 86400;
const PAGE = STATIC.find((p) => p.slug === "editorial-policy")!;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await pageCtx(params);
  return buildMetadata({ locale, path: "/editorial-policy/", title: PAGE.title, description: PAGE.lead });
}
export default async function Page({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: PAGE.title, path: `/${locale}/editorial-policy/` }]} title={PAGE.title} lead={PAGE.lead}>
      <ContentBody page={PAGE} locale={locale} translationNote={dict.common.translationPending} />
    </PageShell>
  );
}
