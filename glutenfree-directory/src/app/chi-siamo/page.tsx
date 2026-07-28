import AboutContent from "@/components/pages/AboutContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Chi siamo — ${SITE_NAME}`,
  description: "La missione di GlutenFree Directory: diventare il punto di riferimento italiano per chi cerca locali, prodotti e informazioni affidabili sul senza glutine.",
  path: "/chi-siamo",
  locale: "it",
});

export default function AboutPage() {
  return <AboutContent locale="it" />;
}
