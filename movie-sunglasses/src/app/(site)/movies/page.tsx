import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { decadeOf } from "@/lib/format";
import { hasFilters, one, type Params } from "@/lib/filter";
import { normalize } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { Grid, MovieCard } from "@/components/cards";
import { LiveForm } from "@/components/live-form";
import { Breadcrumbs, Container, JsonLd, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const p = await searchParams;
  return buildMetadata({ title: "Movies & TV Shows With Famous Sunglasses", description: "Browse films and series by the sunglasses their characters wear: identified models, actors, characters, sources and affordable alternatives.", path: "/movies", noindex: hasFilters(p) });
}

export default async function MoviesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const [c, p] = await Promise.all([getCatalog(), searchParams]);
  const q = normalize(one(p.q) ?? ""), decade = one(p.decade), genre = one(p.genre), kind = one(p.kind);
  const decades = [...new Set(c.movies.map((m) => decadeOf(m.year)))].sort();
  const genres = [...new Set(c.movies.map((m) => m.genre))].sort();
  const rows = c.movies.filter((m) => (!q || normalize(m.title).includes(q)) && (!decade || decadeOf(m.year) === decade) && (!genre || m.genre === genre) && (!kind || m.kind === kind))
    .sort((a, b) => b.year - a.year);
  const sel = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Movies" }]} />
      <PageHeader eyebrow="Directory" title="Movies & TV" intro="Each title lists every pair of sunglasses we have documented, with the actor, the character and the strength of the evidence." />
      <LiveForm action="/movies" label="Filter movies" className="mb-8 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-5">
        <div className="col-span-2"><label htmlFor="m-q" className="mb-1 block text-xs uppercase tracking-widest text-mist">Title</label><input id="m-q" name="q" type="search" defaultValue={one(p.q)} className={sel} /></div>
        <div><label htmlFor="m-d" className="mb-1 block text-xs uppercase tracking-widest text-mist">Decade</label><select id="m-d" name="decade" defaultValue={decade ?? ""} className={sel}><option value="">All</option>{decades.map((d) => <option key={d}>{d}</option>)}</select></div>
        <div><label htmlFor="m-g" className="mb-1 block text-xs uppercase tracking-widest text-mist">Genre</label><select id="m-g" name="genre" defaultValue={genre ?? ""} className={sel}><option value="">All</option>{genres.map((d) => <option key={d}>{d}</option>)}</select></div>
        <div className="flex items-end gap-3"><button className="js-hide rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">Filter</button>{hasFilters(p) && <Link href="/movies" className="pb-2 text-sm underline">Reset</Link>}</div>
      </LiveForm>
      <div id="results" className="transition-opacity"><p className="mb-4 text-sm text-slate" aria-live="polite">{rows.length} titles</p>
      <Grid cols={4}>{rows.map((m) => <MovieCard key={m.id} c={c} movie={m} as="h2" />)}</Grid></div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: c.movies.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/movies/${m.slug}`, name: m.title })) }} />
    </Container>
  );
}
