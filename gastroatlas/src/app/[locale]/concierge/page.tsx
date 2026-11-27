import { Planner } from "@/components/Planner";
import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { T } from "@/lib/i18n";

export const generateMetadata = sectionMeta("concierge");
export default async function Concierge({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <Page heading={T(locale)("Culinary itinerary planner", "Pianifica un itinerario gastronomico")}><Planner locale={locale} /></Page>;
}
