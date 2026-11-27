import { Card } from "@/components/Cards";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T, url } from "@/lib/i18n";

export const generateMetadata = sectionMeta("travel");
export default async function Travel({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return <Page heading={title("travel", locale)}><div className="wide topline"><Card img="tuscany" heading={t("A gastronomic journey through Tuscany", "Un viaggio gastronomico in Toscana")} desc={t("Explore Italy through its tables, vineyards and stays.", "Scopri l’Italia attraverso le sue tavole, i vigneti e i soggiorni.")} href={url(locale, "travel/tuscany")} sizes="(min-width: 1180px) 1180px, 100vw" /></div></Page>;
}
