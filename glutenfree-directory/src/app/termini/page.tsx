import { TermsContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Termini di servizio",
  description: "Termini e condizioni di utilizzo della piattaforma GlutenFree Directory.",
  path: "/termini",
  locale: "it",
});

export default function TermsPage() {
  return <TermsContent locale="it" />;
}
