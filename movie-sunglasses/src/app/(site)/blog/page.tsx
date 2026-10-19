import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ArticleCard, Grid } from "@/components/cards";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = buildMetadata({ title: "Movie Sunglasses Guides & Comparisons", description: "Sourced guides to the sunglasses in famous films, with straight answers, evidence grades, alternatives and honest uncertainty where sources conflict.", path: "/blog" });

export default async function BlogPage() {
  const c = await getCatalog();
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Guides" }]} />
      <PageHeader eyebrow="Research" title="Guides" intro="Every guide answers the question first, then shows its sources — and says so when the evidence is not settled." />
      {c.articles.length ? <Grid>{c.articles.map((a) => <ArticleCard key={a.id} a={a} c={c} />)}</Grid> : <p className="text-slate">No guides published yet.</p>}
    </Container>
  );
}
