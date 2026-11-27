import { Card } from "@/components/Cards";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T, url } from "@/lib/i18n";

export const generateMetadata = sectionMeta("magazine");
export default async function Magazine({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return (
    <Page heading={title("magazine", locale)}>
      <div className="grid two topline">
        <Card img="wine" heading={t("How to read a wine pairing", "Come leggere un abbinamento vini")} desc={t("Wine", "Vino")} href={url(locale, "magazine/wine")} sizes="(min-width: 1100px) 580px, 100vw" />
        <Card img="plate2" heading={t("How to compare tasting menus", "Come confrontare i menù degustazione")} desc={t("Guide", "Guida")} href={url(locale, "magazine/menus")} sizes="(min-width: 1100px) 580px, 100vw" />
      </div>
    </Page>
  );
}
