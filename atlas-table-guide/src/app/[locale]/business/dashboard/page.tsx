import type { Metadata } from "next";
import { pageCtx } from "../../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { PartnerDashboard } from "@/features/PartnerDashboard";
import { tx } from "@/i18n";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await pageCtx(params);
  return buildMetadata({ locale, path: "/business/dashboard/", title: tx(locale, "Partner dashboard", "Dashboard partner"), description: tx(locale, "Manage your venue's details and prices.", "Gestisci i dati e i prezzi del tuo locale."), noindex: true });
}
export default async function Dashboard({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.business, path: `/${locale}/business/` }, { name: tx(locale, "Dashboard", "Dashboard"), path: `/${locale}/business/dashboard/` }]} title={tx(locale, "Partner dashboard", "Dashboard partner")} lead={tx(locale, "Edit your venue after your claim is approved. Recognitions and editorial fields can never be changed by partners.", "Modifica il tuo locale dopo l'approvazione della rivendicazione. Riconoscimenti e campi editoriali non sono mai modificabili dai partner.")}>
      <PartnerDashboard locale={locale} />
    </PageShell>
  );
}
