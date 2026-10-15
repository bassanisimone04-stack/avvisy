import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ActorCard, Grid } from "@/components/cards";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const revalidate = 600;
export const metadata: Metadata = buildMetadata({ title: "Actors & Their Movie Sunglasses", description: "Find the sunglasses worn by actors on screen, from Tom Cruise to Audrey Hepburn: characters, films, identified models and where to buy them.", path: "/actors" });

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
