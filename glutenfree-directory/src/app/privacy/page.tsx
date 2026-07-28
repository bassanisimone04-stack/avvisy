import { PrivacyContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Informativa sulla privacy di GlutenFree Directory: come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.",
  path: "/privacy",
  locale: "it",
});

export default function PrivacyPage() {
  return <PrivacyContent locale="it" />;
}
