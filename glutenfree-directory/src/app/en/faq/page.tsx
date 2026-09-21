import FaqPageContent from "@/components/pages/FaqPageContent";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `FAQ: Celiac Disease and Gluten-Free — ${SITE_NAME}`,
  description: "Answers to the most searched questions about celiac disease, gluten-free restaurants, cross-contamination, certified products and AIC vouchers.",
  path: "/faq",
  locale: "en",
});

export default function FaqPageEn() {
  return <FaqPageContent locale="en" />;
}
