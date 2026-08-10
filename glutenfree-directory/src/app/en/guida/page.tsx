import GuideContent from "@/components/pages/GuideContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";
import { BUSINESSES } from "@/lib/mock-businesses";

export const metadata = pageMetadata({
  title: `The ${SITE_NAME} Guide (PDF) — ${BUSINESSES.length} verified venues`,
  description: `Download the PDF guide with ${BUSINESSES.length} real, verified gluten-free venues across Italy, organized by region and city: restaurants, pizzerias, hotels and AIC-certified shops.`,
  path: "/guida",
  locale: "en",
});

export default function GuidePageEn() {
  return <GuideContent locale="en" />;
}
