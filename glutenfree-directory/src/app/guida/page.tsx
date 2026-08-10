import GuideContent from "@/components/pages/GuideContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";
import { BUSINESSES } from "@/lib/mock-businesses";

export const metadata = pageMetadata({
  title: `La Guida ${SITE_NAME} (PDF) — ${BUSINESSES.length} locali verificati`,
  description: `Scarica la guida PDF con ${BUSINESSES.length} locali senza glutine reali e verificati in tutta Italia, organizzati per regione e città: ristoranti, pizzerie, hotel e negozi certificati AIC.`,
  path: "/guida",
  locale: "it",
});

export default function GuidePage() {
  return <GuideContent locale="it" />;
}
