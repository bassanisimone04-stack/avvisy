import AboutContent from "@/components/pages/AboutContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `About us — ${SITE_NAME}`,
  description: "Mappa Senza Glutine's mission: how we verify gluten-free restaurants and venues in Italy, from celiac disease to AIC certification and food safety.",
  path: "/chi-siamo",
  locale: "en",
});

export default function AboutPageEn() {
  return <AboutContent locale="en" />;
}
