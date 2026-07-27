import { CookieContent } from "@/components/pages/LegalContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Informativa sui cookie tecnici e di preferenza utilizzati da GlutenFree Directory.",
  path: "/cookie",
  locale: "it",
});

export default function CookiePage() {
  return <CookieContent locale="it" />;
}
