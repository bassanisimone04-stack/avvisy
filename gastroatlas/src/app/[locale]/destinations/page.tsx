import { CityCard } from "@/components/Cards";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { cities, title } from "@/data/catalog";

export const generateMetadata = sectionMeta("destinations");
export default async function Destinations({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <Page heading={title("destinations", locale)}><div className="grid cities topline">{cities.map((c) => <CityCard key={c.slug} city={c} locale={locale} />)}</div></Page>;
}
