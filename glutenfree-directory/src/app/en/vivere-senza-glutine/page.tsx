import Guide2Content from "@/components/pages/Guide2Content";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Live Gluten-Free: the PDF Guide | ${SITE_NAME}`,
  description:
    "Download the PDF with 11 chapters on diagnosis, food safety, cross-contamination and everyday life with celiac disease: verified content from the blog.",
  path: "/vivere-senza-glutine",
  locale: "en",
});

export default function VivereSenzaGlutinePageEn() {
  return <Guide2Content locale="en" />;
}
