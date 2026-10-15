import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ActorCard, Grid } from "@/components/cards";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const revalidate = 600;
export const metadata: Metadata = buildMetadata({ title: "Actors & the Sunglasses They Wore On Screen", description: "Browse actors by the sunglasses they wore in film and TV, with characters, titles and identified models.", path: "/actors" });

export default async function ActorsPage() {
  const c = await getCatalog();
  const rows = [...c.actors].sort((a, b) => c.modelsForActor(b.id).length - c.modelsForActor(a.id).length || a.name.localeCompare(b.name));
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Actors" }]} />
      <PageHeader eyebrow="Directory" title="Actors" intro="Find the frames behind a performance. Each profile lists the titles, characters and models we have documented." />
      <Grid cols={3}>{rows.map((a) => <ActorCard key={a.id} c={c} actor={a} />)}</Grid>
    </Container>
  );
}
