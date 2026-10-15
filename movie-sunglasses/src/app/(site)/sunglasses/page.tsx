import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { hasFilters, type Params } from "@/lib/filter";
import { buildMetadata } from "@/lib/seo";
import { SunglassesFilters } from "@/components/filter-bar";
import { ModelResults } from "@/components/model-grid";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const p = await searchParams;
  return buildMetadata({ title: "Movie Sunglasses Catalog: Models, Brands & Where to Buy", description: "Browse sunglasses worn in movies and TV. Filter by film, actor, brand, shape, colour and price, with evidence-graded identification.", path: "/sunglasses", noindex: hasFilters(p) || "page" in p });
}

export default async function SunglassesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const [c, p] = await Promise.all([getCatalog(), searchParams]);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Sunglasses" }]} />
      <PageHeader eyebrow="Catalog" title="Movie Sunglasses" intro="Every model below is tied to a film appearance or serves as a documented alternative. Use the filters to narrow by film, actor, brand, shape, colour, evidence level or price band." />
      <SunglassesFilters c={c} p={p} />
      <ModelResults c={c} p={p} basePath="/sunglasses" />
    </Container>
  );
}
