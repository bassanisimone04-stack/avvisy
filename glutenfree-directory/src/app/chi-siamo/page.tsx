import AboutContent from "@/components/pages/AboutContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Chi siamo — ${SITE_NAME}`,
  description: "La missione di Mappa Senza Glutine: come verifichiamo i ristoranti e locali senza glutine in Italia, tra celiachia, certificazione AIC e sicurezza alimentare.",
  path: "/chi-siamo",
  locale: "it",
});

export default function AboutPage() {
  return <AboutContent locale="it" />;
}
