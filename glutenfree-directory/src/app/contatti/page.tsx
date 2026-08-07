import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contatti",
  description: "Contatta il team di Mappa Senza Glutine per domande, suggerimenti o segnalazioni.",
  path: "/contatti",
  locale: "it",
});

export default function ContactPage() {
  return <ContactContent locale="it" />;
}
