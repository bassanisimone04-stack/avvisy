import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { BrandCard, Grid } from "@/components/cards";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const revalidate = 600;
export const metadata: Metadata = buildMetadata({ title: "Movie Sunglasses Brands: Ray-Ban, Persol & More", description: "Eyewear brands behind the movie sunglasses we track, from Ray-Ban and Persol to Tom Ford, with every documented model, source and alternative.", path: "/brands" });

export default async function BrandsPage() {
  const c = await getCatalog();
  const rows = [...c.brands].sort((a, b) => c.modelsForBrand(b.id).length - c.modelsForBrand(a.id).length || a.name.localeCompare(b.name));
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Brands" }]} />
      <PageHeader eyebrow="Directory" title="Brands" intro="The makers behind the frames — from the Ray-Ban Aviator to one-off custom pieces." />
      <Grid cols={4}>{rows.map((b) => <BrandCard key={b.id} c={c} brand={b} />)}</Grid>
    </Container>
  );
}
