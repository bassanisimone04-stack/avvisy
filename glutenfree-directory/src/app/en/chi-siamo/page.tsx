import AboutContent from "@/components/pages/AboutContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `About us — ${SITE_NAME}`,
  description: "GlutenFree Directory's mission: becoming Italy's go-to reference for reliable gluten-free places, products and information.",
  path: "/chi-siamo",
  locale: "en",
});

export default function AboutPageEn() {
  return <AboutContent locale="en" />;
}
