import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { ContactForm } from "./form";

export const metadata = buildMetadata({ title: "Contact: Corrections, Sources & Partnerships", description: "Send a correction with a source, suggest a film, or ask about partnerships.", path: "/contact" });
export default function Contact() {
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Contact" }]} />
      <div className="mx-auto max-w-xl">
        <PageHeader eyebrow="Contact" title="Tell us what we missed" intro="Corrections with a source, film suggestions, press and partnership enquiries are all welcome." />
        <ContactForm />
      </div>
    </Container>
  );
}
