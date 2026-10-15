import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { STYLES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { GlassesArt } from "@/components/glasses";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const revalidate = 600;
export const metadata: Metadata = buildMetadata({ title: "Sunglasses Styles: Aviator, Wayfarer, Cat-Eye & More", description: "Shop movie sunglasses by silhouette — aviator, wayfarer, cat-eye, rectangular, oval, vintage and futuristic.", path: "/styles" });

export default async function StylesPage() {
  const c = await getCatalog();
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Styles" }]} />
      <PageHeader eyebrow="Directory" title="Styles" intro="Start with a silhouette and work back to the film that made it famous." />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STYLES.map((s) => { const ms = c.modelsForStyle(s.slug); const sample = ms[0]; return (
          <li key={s.slug}><Link href={`/styles/${s.slug}`} className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-b from-paper to-[#ebe8df] p-6">{sample && <GlassesArt shape={sample.shape} frame={sample.frameColor} lens={sample.lensColor} className="w-2/3" />}</div>
            <div className="p-5"><h2 className="font-display text-3xl font-semibold">{s.name}</h2><p className="mt-1 text-sm text-slate">{s.blurb}</p><p className="mt-3 text-xs uppercase tracking-widest text-champagne-text">{ms.length} models</p></div>
          </Link></li>); })}
      </ul>
    </Container>
  );
}
