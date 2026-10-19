import { notFoundOrRedirect } from "@/lib/redirects";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { brandSeo } from "@/lib/seo-copy";
import { Breadcrumbs, Container, JsonLd, PageHeader } from "@/components/ui";
import { Grid, ModelCard } from "@/components/cards";

export const revalidate = 600;
export async function generateStaticParams() { return (await getCatalog()).brands.map((b) => ({ slug: b.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCatalog();
  const b = c.brands.find((x) => x.slug === slug);
  if (!b) return {};
  const seo = brandSeo(c, b);
  return buildMetadata({ title: seo.title, description: seo.description, path: `/brands/${b.slug}`, absoluteTitle: true, noindex: c.modelsForBrand(b.id).length < 2 });
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const b = c.brands.find((x) => x.slug === slug);
  if (!b) return notFoundOrRedirect(`/brands/${slug}`);
  const models = c.modelsForBrand(b.id);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Brands", href: "/brands" }, { name: b.name }]} />
      <PageHeader eyebrow={b.country} title={b.name} intro={b.description} />
      {b.website && <p className="-mt-6 mb-8 text-sm"><a className="text-champagne-text underline underline-offset-4" href={b.website} rel="nofollow noopener noreferrer" target="_blank">Official website<span className="sr-only"> (opens in new tab)</span></a></p>}
      <Grid>{models.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Brand", name: b.name, url: b.website ?? `${SITE.url}/brands/${b.slug}`, description: b.description }} />
    </Container>
  );
}
