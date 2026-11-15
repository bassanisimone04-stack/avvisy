import { PrivacyContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Mappa Senza Glutine's privacy notice: how we collect, use and protect your personal data.",
  path: "/privacy",
  locale: "en",
});

export default function PrivacyPageEn() {
  return <PrivacyContent locale="en" />;
}
