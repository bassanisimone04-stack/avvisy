import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ContentBody } from "@/features/ContentPageView";
import { STATIC } from "@/data/pages";

export const revalidate = 86400;
const BASE = STATIC.find((p) => p.slug === "about")!;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await pageCtx(params);
  const T = locale === "it" && BASE.it ? BASE.it : BASE;
  return buildMetadata({ locale, path: "/about/", title: T.title, description: T.lead });
}
export default async function Page({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  const T = locale === "it" && BASE.it ? BASE.it : BASE;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: T.title, path: `/${locale}/about/` }]} title={T.title} lead={T.lead}>
      <ContentBody page={BASE} locale={locale} translationNote={dict.common.translationPending} />
    </PageShell>
  );
}
