import { Card } from "@/components/Cards";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T, url } from "@/lib/i18n";

export const generateMetadata = sectionMeta("experiences");
export default async function Experiences({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  const items: [string, string, string, string][] = [
    ["tasting", t("Exceptional tasting menus", "Menù degustazione"), t("Discover and compare", "Scopri e confronta"), `${url(locale, "restaurants")}?sort=price`],
    ["lake", t("Dine & Stay", "Cena e soggiorno"), t("Remarkable places to stay", "Soggiorni per chi viaggia per il gusto"), url(locale, "hotels")],
    ["plate1", t("Last-minute tables", "Tavoli dell’ultimo minuto"), t("Partner availability pending", "Disponibilità dei partner in attesa"), url(locale, "experiences/last-minute")],
    ["wine", t("Give an experience", "Regala un’esperienza"), t("Ideas for a special occasion", "Idee per un’occasione speciale"), url(locale, "gifts")],
  ];
  return <Page heading={title("experiences", locale)}><div className="grid two topline">{items.map(([img, h, d, href]) => <Card key={img} img={img} heading={h} desc={d} href={href} sizes="(min-width: 1100px) 580px, 100vw" />)}</div></Page>;
}
