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
      <div className="wide topline"><Photo name="dining" alt={t("A dining room with warm lighting", "Una sala da pranzo con luce calda")} sizes="(min-width: 1180px) 1180px, 100vw" /></div>
      <Notice>{t("Verified stays and partner booking links are pending.", "I soggiorni verificati e i link di prenotazione sono in attesa di attivazione.")}</Notice>
      <Link className="btn" href={`${url(locale, "restaurants")}?rooms=1`}>{t("Browse demo restaurants with rooms", "Esplora i ristoranti demo con camere")}</Link>
    </Page>
  );
}
