import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `${SITE_NAME}: ristoranti e locali senza glutine in Italia`,
  description: SITE_DESCRIPTION,
  path: "/",
  locale: "it",
});

export default function HomePage() {
  return <HomeContent locale="it" />;
}
