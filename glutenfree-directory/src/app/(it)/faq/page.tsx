import FaqPageContent from "@/components/pages/FaqPageContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `FAQ celiachia e senza glutine — ${SITE_NAME}`,
  description: "Le risposte alle domande più cercate su celiachia, ristoranti senza glutine, contaminazione crociata, prodotti certificati e buoni pasto AIC.",
  path: "/faq",
  locale: "it",
});

export default function FaqPage() {
  return <FaqPageContent locale="it" />;
}
