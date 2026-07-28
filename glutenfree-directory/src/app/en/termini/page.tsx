import { TermsContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for using the GlutenFree Directory platform.",
  path: "/termini",
  locale: "en",
});

export default function TermsPageEn() {
  return <TermsContent locale="en" />;
}
