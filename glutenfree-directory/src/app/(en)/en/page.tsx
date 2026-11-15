import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION_EN } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Mappa Senza Glutine: gluten-free restaurants in Italy",
  description: SITE_DESCRIPTION_EN,
  path: "/",
  locale: "en",
});

export default function HomePageEn() {
  return <HomeContent locale="en" />;
}
