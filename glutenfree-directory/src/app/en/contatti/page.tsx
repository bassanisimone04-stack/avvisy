import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the GlutenFree Directory team for questions, suggestions or reports.",
  path: "/contatti",
  locale: "en",
});

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
