import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { SavedList } from "./saved-list";

export const metadata: Metadata = buildMetadata({ title: "Saved Sunglasses", description: "Your saved movie sunglasses, stored privately in this browser.", path: "/saved", noindex: true });

export default function SavedPage() {
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Saved" }]} />
      <PageHeader eyebrow="Your shortlist" title="Saved sunglasses" intro="Saved in this browser only. We do not store your list on our servers." />
      <SavedList />
    </Container>
  );
}
