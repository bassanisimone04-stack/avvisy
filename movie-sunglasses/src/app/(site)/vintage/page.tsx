import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { Grid, ModelCard } from "@/components/cards";

export const revalidate = 600;
export const metadata: Metadata = buildMetadata({ title: "Vintage & Rare Movie Sunglasses: Out-of-Production Models & Reissues", description: "Historic, rare and out-of-production movie sunglasses, plus the official reissues that replace them.", path: "/vintage" });

export default async function VintagePage() {
  const c = await getCatalog();
  const hist = c.models.filter((m) => !c.isAlternativeOnly(m.id) && (m.status === "vintage" || m.status === "discontinued"));
  const reissues = c.models.filter((m) => c.appsForModel(m.id).some((a) => a.matchType === "official_reissue" && c.matchOf(a).type === "official_reissue"));
  const rare = c.models.filter((m) => !c.isAlternativeOnly(m.id) && m.status === "unknown");
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Vintage" }]} />
      <PageHeader eyebrow="Archive" title="Vintage & Rare Eyewear" intro="Period pieces whose original runs have ended, the official reissues that carry the design on, and rare models whose availability we cannot yet confirm. Vintage pairs sell on secondary markets where authenticity varies — look for seller guarantees." />
      <h2 className="font-display mb-5 text-4xl font-semibold">Historic & out of production</h2>
      <Grid>{hist.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid>
      <h2 className="font-display mb-5 mt-16 text-4xl font-semibold">Official reissues & tribute editions</h2>
      <Grid>{reissues.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid>
      <h2 className="font-display mb-2 mt-16 text-4xl font-semibold">Rare — availability unverified</h2>
      <p className="mb-5 text-slate">Models where sources disagree on whether they are still sold.</p>
      <Grid>{rare.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid>
    </Container>
  );
}
