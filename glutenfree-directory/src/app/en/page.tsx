import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION_EN, SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `${SITE_NAME}: Gluten-Free Restaurants and Venues in Italy`,
  description: SITE_DESCRIPTION_EN,
  path: "/",
  locale: "en",
});

export default function HomePageEn() {
  return <HomeContent locale="en" />;
}
