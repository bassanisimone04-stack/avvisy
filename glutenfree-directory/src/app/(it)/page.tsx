import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Mappa Senza Glutine: ristoranti e locali per celiaci",
  description: SITE_DESCRIPTION,
  path: "/",
  locale: "it",
});

export default function HomePage() {
  return <HomeContent locale="it" />;
}
