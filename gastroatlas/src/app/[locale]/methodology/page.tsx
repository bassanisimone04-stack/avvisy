import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T } from "@/lib/i18n";

export const generateMetadata = sectionMeta("methodology");
export default async function Methodology({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <Page heading={title("methodology", locale)}><p className="lead">{T(locale)("The Price Index requires at least five verified observations per group. Demo prices are excluded. Published figures should include the date, sample size and source.", "L’indice richiede almeno cinque rilevazioni verificate per gruppo. I prezzi dimostrativi sono esclusi. Le cifre pubblicate devono riportare data, campione e fonte.")}</p></Page>;
}
