import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { STYLES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { Grid, ModelCard } from "@/components/cards";

export const revalidate = 600;
export function generateStaticParams() { return STYLES.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = STYLES.find((x) => x.slug === slug);
  return s ? buildMetadata({ title: `${s.name} Sunglasses Worn in Movies`, description: `${s.blurb} Browse ${s.name.toLowerCase()} sunglasses seen on screen, with cheaper alternatives.`, path: `/styles/${s.slug}` }) : {};
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = STYLES.find((x) => x.slug === slug);
  if (!s) notFound();
  const c = await getCatalog();
  const ms = c.modelsForStyle(s.slug);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Styles", href: "/styles" }, { name: s.name }]} />
      <PageHeader eyebrow="Style" title={`${s.name} sunglasses`} intro={s.blurb} />
      {ms.length ? <Grid>{ms.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid> : <p className="text-slate">No models in this style yet.</p>}
    </Container>
  );
}
