import Guide2Content from "@/components/pages/Guide2Content";
import { pageMetadata } from "@/lib/seo";
import meta from "@/lib/guide-meta.json";

export const metadata = pageMetadata({
  title: "Vivere Senza Glutine: guida PDF per celiaci",
  description:
    `Guida PDF per chi è celiaco: ${meta.it.chapters} capitoli dalla diagnosi ai viaggi, scheda rapida, checklist per il ristorante e tessera di traduzione da stampare.`,
  path: "/vivere-senza-glutine",
  locale: "it",
});

export default function VivereSenzaGlutinePage() {
  return <Guide2Content locale="it" />;
}
