import Link from "next/link";
import { notFoundOrRedirect } from "@/lib/redirects";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, JsonLd, MatchBadge, PageHeader } from "@/components/ui";
import { Grid, ModelCard } from "@/components/cards";

export const revalidate = 600;
export async function generateStaticParams() { return (await getCatalog()).actors.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCatalog();
  const a = c.actors.find((x) => x.slug === slug);
  if (!a) return {};
  const models = c.modelsForActor(a.id).map((m) => m.name).slice(0, 3).join(", ");
  return buildMetadata({ title: `${a.name}'s Movie Sunglasses: Models, Films & Alternatives`, description: `${models ? `${a.name} on screen: ${models}. ` : ""}Evidence-graded identification of sunglasses worn by ${a.name}, with sources and where to buy.`, path: `/actors/${a.slug}` });
}

export default async function ActorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const a = c.actors.find((x) => x.slug === slug);
  if (!a) return notFoundOrRedirect(`/actors/${slug}`);
  const apps = c.appearances.filter((x) => x.actorId === a.id);
  const models = c.modelsForActor(a.id);
  const roles = c.characters.filter((ch) => ch.actorId === a.id);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Actors", href: "/actors" }, { name: a.name }]} />
      <PageHeader eyebrow="Actor" title={a.name} intro={a.bio ?? `Sunglasses worn by ${a.name} in the titles we have documented.`} />
      <h2 className="font-display text-4xl font-semibold">Roles</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {roles.map((ch) => { const mv = c.movieById.get(ch.movieId)!; return <li key={ch.id} className="rounded-xl border border-line bg-white p-4"><Link className="font-display text-2xl font-semibold hover:underline" href={`/movies/${mv.slug}`}>{mv.title}</Link><p className="text-sm text-slate">{ch.name} · {mv.year}</p></li>; })}
      </ul>
      {apps.length > 0 && <>
        <h2 className="font-display mt-14 text-4xl font-semibold">Identifications</h2>
        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
          {apps.map((x) => { const m = c.modelById.get(x.modelId)!, mv = c.movieById.get(x.movieId)!; return (
            <li key={x.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><span><Link className="font-medium underline-offset-4 hover:underline" href={`/sunglasses/${m.slug}`}>{m.name}</Link> <span className="text-sm text-slate">in {mv.title}</span></span><MatchBadge type={c.matchOf(x).type} title /></li>); })}
        </ul>
        <h2 className="font-display mt-14 text-4xl font-semibold">Models</h2>
        <div className="mt-5"><Grid>{models.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid></div>
      </>}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: a.name, url: `${SITE.url}/actors/${a.slug}` }} />
    </Container>
  );
}
