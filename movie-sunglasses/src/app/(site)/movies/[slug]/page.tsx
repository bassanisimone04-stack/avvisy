import Link from "next/link";
import { notFoundOrRedirect } from "@/lib/redirects";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, JsonLd, MatchBadge, PageHeader } from "@/components/ui";
import { ArticleCard, Grid, ModelCard } from "@/components/cards";
import { ViewBeacon } from "@/components/misc";

export const revalidate = 600;
export async function generateStaticParams() { return (await getCatalog()).movies.map((m) => ({ slug: m.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCatalog();
  const mv = c.movies.find((m) => m.slug === slug);
  if (!mv) return {};
  const names = c.modelsForMovie(mv.id).map((m) => m.name).slice(0, 3).join(", ");
  return buildMetadata({ title: `${mv.title} (${mv.year}) Sunglasses: Models Worn On Screen`, description: `Which sunglasses appear in ${mv.title}? ${names ? names + ". " : ""}Evidence-graded identification, sources and alternatives.`, path: `/movies/${mv.slug}` });
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const mv = c.movies.find((m) => m.slug === slug);
  if (!mv) return notFoundOrRedirect(`/movies/${slug}`);
  const apps = c.appearances.filter((a) => a.movieId === mv.id);
  const models = c.modelsForMovie(mv.id);
  const cast = c.actorsForMovie(mv.id);
  const articles = c.articlesForMovie(mv.id);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Movies", href: "/movies" }, { name: mv.title }]} />
      <ViewBeacon type="movie" id={mv.id} />
      <PageHeader eyebrow={`${mv.kind === "series" ? "TV series" : "Film"} · ${mv.genre} · ${mv.year}`} title={`${mv.title} sunglasses`} intro={mv.synopsis} />
      {cast.length > 0 && <p className="-mt-4 mb-10 text-slate">With {cast.map((a, i) => <span key={a.id}>{i > 0 && ", "}<Link className="underline underline-offset-4" href={`/actors/${a.slug}`}>{a.name}</Link></span>)}</p>}
      <h2 className="font-display text-4xl font-semibold">Who wears what</h2>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
        {apps.map((a) => {
          const m = c.modelById.get(a.modelId)!, ac = c.actorById.get(a.actorId)!, ch = c.charById.get(a.characterId)!;
          return (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div><p className="font-display text-2xl font-semibold">{ch.name} <span className="text-base font-normal text-slate">played by <Link className="underline underline-offset-4" href={`/actors/${ac.slug}`}>{ac.name}</Link></span></p>
                <p className="text-sm"><Link className="text-champagne-text underline underline-offset-4" href={`/sunglasses/${m.slug}`}>{m.name}</Link></p></div>
              <MatchBadge type={c.matchOf(a).type} title />
            </li>
          );
        })}
        {apps.length === 0 && <li className="p-6 text-slate">No sunglasses documented for this title yet.</li>}
      </ul>
      {models.length > 0 && <><h2 className="font-display mt-16 text-4xl font-semibold">Models from {mv.title}</h2><div className="mt-6"><Grid>{models.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid></div></>}
      {articles.length > 0 && <><h2 className="font-display mt-16 text-4xl font-semibold">Guides</h2><div className="mt-6"><Grid>{articles.map((a) => <ArticleCard key={a.id} a={a} c={c} />)}</Grid></div></>}
      <JsonLd data={{ "@context": "https://schema.org", "@type": mv.kind === "series" ? "TVSeries" : "Movie", name: mv.title, datePublished: String(mv.year), genre: mv.genre, description: mv.synopsis, url: `${SITE.url}/movies/${mv.slug}`, actor: cast.map((a) => ({ "@type": "Person", name: a.name })) }} />
    </Container>
  );
}
