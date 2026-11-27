import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { AccountPanel } from "@/features/AccountPanel";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/account/", title: dict.nav.account, description: dict.nav.account, noindex: true });
}
export default async function Account({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  return <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.account, path: `/${locale}/account/` }]} title={dict.nav.account}><AccountPanel locale={locale} /></PageShell>;
}
