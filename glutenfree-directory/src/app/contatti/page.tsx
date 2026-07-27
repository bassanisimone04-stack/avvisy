import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contatti",
  description: "Contatta il team di GlutenFree Directory per domande, suggerimenti o segnalazioni.",
  path: "/contatti",
  locale: "it",
});

export default function ContactPage() {
  return <ContactContent locale="it" />;
}
