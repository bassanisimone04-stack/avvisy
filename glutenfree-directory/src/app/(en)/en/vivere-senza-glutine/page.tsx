import Guide2Content from "@/components/pages/Guide2Content";
import { pageMetadata } from "@/lib/seo";
import meta from "@/lib/guide-meta.json";

export const metadata = pageMetadata({
  title: "Live Gluten-Free: celiac PDF guide",
  description:
    `PDF guide for living with celiac disease: ${meta.en.chapters} chapters from diagnosis to travel, quick sheet, restaurant checklist and an Italian phrase card to print.`,
  path: "/vivere-senza-glutine",
  locale: "en",
});

export default function VivereSenzaGlutinePageEn() {
  return <Guide2Content locale="en" />;
}
