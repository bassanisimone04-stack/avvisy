import type { Metadata } from "next";
import FaqSection from "@/components/FaqSection";
import { JsonLd, faqPageJsonLd } from "@/lib/schema";
import { CORE_FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Mobile Dog Grooming FAQ",
  description:
    "Answers on mobile dog grooming cost, van hookups, breed size limits, tipping etiquette, and mobile cat grooming.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(CORE_FAQS)} />
      <FaqSection />
    </>
  );
}
