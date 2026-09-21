import Guide2Content from "@/components/pages/Guide2Content";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Vivere Senza Glutine: la guida PDF | ${SITE_NAME}`,
  description:
    "Scarica il PDF con 11 capitoli su diagnosi, sicurezza alimentare, contaminazione crociata e vita quotidiana da celiaco: contenuti verificati dal blog.",
  path: "/vivere-senza-glutine",
  locale: "it",
});

export default function VivereSenzaGlutinePage() {
  return <Guide2Content locale="it" />;
}
