import { LegalClear } from "@/components/LegalClear";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T } from "@/lib/i18n";

export const generateMetadata = sectionMeta("legal");
export default async function Legal({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return <Page heading={title("legal", locale)}><p className="lead">{t("This demo stores favourites and comparison choices in your browser. A shared comparison link includes the selected demo listings.", "Questa demo salva preferiti e confronti nel tuo browser. Un link di confronto condiviso contiene le schede dimostrative selezionate.")}</p><LegalClear locale={locale} /></Page>;
}
