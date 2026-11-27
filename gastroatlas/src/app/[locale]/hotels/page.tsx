import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Notice, Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T, url } from "@/lib/i18n";

export const generateMetadata = sectionMeta("hotels");
export default async function Hotels({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return (
    <Page heading={title("hotels", locale)}>
      <div className="wide topline"><Photo name="terrazza-lago" alt={t("A stone terrace with set tables overlooking a lake at dusk", "Una terrazza in pietra con tavoli apparecchiati su un lago al tramonto")} sizes="(min-width: 1180px) 1180px, 100vw" /></div>
      <Notice>{t("Verified stays and partner booking links are pending.", "I soggiorni verificati e i link di prenotazione sono in attesa di attivazione.")}</Notice>
      <Link className="btn" href={`${url(locale, "restaurants")}?rooms=1`}>{t("Browse demo restaurants with rooms", "Esplora i ristoranti demo con camere")}</Link>
    </Page>
  );
}
