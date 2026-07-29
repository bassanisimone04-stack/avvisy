import { CookieContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Notice on technical and preference cookies used by Mappa Senza Glutine.",
  path: "/cookie",
  locale: "en",
});

export default function CookiePageEn() {
  return <CookieContent locale="en" />;
}
