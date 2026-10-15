import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { trendingModels } from "@/lib/trending";
import { STYLES, MATCH_LABEL, MATCH_HELP, PRICE_BAND_LABEL, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SearchBox } from "@/components/search-box";
import { GlassesArt } from "@/components/glasses";
import { ActorCard, ArticleCard, BrandCard, Grid, ModelCard, MovieCard } from "@/components/cards";
import { Container, MatchBadge, SectionHeading, btn, btnGhost } from "@/components/ui";
import { Reveal } from "@/components/misc";
import { TiltStage } from "@/components/interactive";
import type { MatchType } from "@/lib/types";

export const revalidate = 300;
export const metadata = buildMetadata({ title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, path: "/", absoluteTitle: true });

export default async function Home() {
  const c = await getCatalog();
  const trending = await trendingModels(c, 6);
  const hero = c.modelById.get("ray-ban-aviator-classic-rb3025")!;
  const iconic = c.appearances
    .filter((a) => ["top-gun", "risky-business", "breakfast-at-tiffanys", "the-thomas-crown-affair-1968", "men-in-black"].includes(a.movieId) && c.matchOf(a).type !== "unconfirmed")
    .filter((a, i, all) => all.findIndex((x) => x.movieId === a.movieId) === i).slice(0, 4);
  const actors = [...c.actors].sort((a, b) => c.modelsForActor(b.id).length - c.modelsForActor(a.id).length).filter((a) => c.modelsForActor(a.id).length).slice(0, 8);
  const movies = [...c.movies].sort((a, b) => c.modelsForMovie(b.id).length - c.modelsForMovie(a.id).length || b.year - a.year).slice(0, 8);
  const vintage = c.models.filter((m) => m.status === "vintage" || m.styleTags.includes("vintage")).filter((m) => !c.isAlternativeOnly(m.id)).slice(0, 3);
  const tiers = (["under50", "under100", "under200"] as const).map((b) => ({ band: b, n: c.models.filter((m) => c.isAlternativeOnly(m.id) && c.priceBandOf(m).band === b).length }));
  const budget = c.models.filter((m) => c.isAlternativeOnly(m.id) && ["under50", "under100"].includes(c.priceBandOf(m).band ?? "")).slice(0, 3);
  const brands = c.brands.filter((b) => c.modelsForBrand(b.id).length >= 2).slice(0, 4);
  const marquee = [...c.movies, ...c.movies].map((m) => m.title);
  const stats = [[c.movies.length, "titles"], [c.screenModels.length, "documented models"], [c.evidence.length, "sourced citations"]];

  return (
    <>
      {/* HERO */}
      <section className="on-dark grain relative isolate overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(201,170,113,.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(255,255,255,.07),transparent_50%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-5 bg-black sm:h-8" /><div aria-hidden className="absolute inset-x-0 bottom-0 h-5 bg-black sm:h-8" />
        <Container className="relative grid gap-10 pb-24 pt-24 sm:pt-28 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pb-32 lg:pt-36">
          <div>
            <p className="eyebrow mb-5">The movie sunglasses directory</p>
            <h1 className="font-display text-[3.4rem] font-semibold leading-[0.9] sm:text-7xl lg:text-[5.6rem]">
              Find the Sunglasses <em className="font-medium text-champagne">Behind the Screen.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              Search by film, actor, character or brand. Every identification is graded by evidence — then compared, priced and matched with alternatives for any budget.
            </p>
            <div className="mt-9 max-w-xl"><SearchBox variant="hero" /></div>
            <p className="mt-5 flex flex-wrap gap-2 text-sm text-white/60">
              <span className="py-1">Popular:</span>
              {[["Top Gun", "/movies/top-gun"], ["Wayfarer", "/styles/wayfarer"], ["Persol 714", "/sunglasses/persol-714-steve-mcqueen"], ["Under $50", "/affordable-alternatives"]].map(([l, h]) => (
                <Link key={h} href={h} className="rounded-full border border-white/20 px-3 py-1 transition hover:border-champagne hover:text-champagne">{l}</Link>
              ))}
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-lg" aria-hidden>
            <div className="absolute -inset-10 rounded-full bg-champagne/15 blur-3xl" />
            <TiltStage><GlassesArt shape={hero.shape} frame={hero.frameColor} lens={hero.lensColor} className="relative w-full animate-float drop-shadow-[0_40px_60px_rgba(0,0,0,.6)]" /></TiltStage>
          </div>
        </Container>
        <div className="border-t border-white/10 bg-black/40 py-4" aria-hidden>
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl italic text-white/40">
            {marquee.map((t, i) => <span key={i} className="flex items-center gap-10">{t}<span className="text-champagne">◆</span></span>)}
          </div>
        </div>
      </section>

      <Container className="mt-6">
        <dl className="grid grid-cols-3 divide-x divide-line border-b border-line py-6 text-center">
          {stats.map(([n, l]) => <div key={String(l)}><dt className="text-xs uppercase tracking-widest text-mist">{l}</dt><dd className="font-display text-4xl font-semibold">{n}</dd></div>)}
        </dl>
      </Container>

      {/* TRENDING */}
      <Container className="mt-24">
        <Reveal><SectionHeading eyebrow="Trending now" title="Trending Movie Sunglasses" href="/sunglasses" linkLabel="Browse the catalog" /></Reveal>
        <Reveal><Grid>{trending.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid></Reveal>
        <p className="mt-4 text-xs text-mist">Ranked by views and store clicks over the last 30 days; when traffic is low, by strength of evidence.</p>
      </Container>

      {/* ICONIC LOOKS */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Editor’s picks" title="Iconic Movie Looks" /></Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {iconic.map((a, i) => {
            const m = c.modelById.get(a.modelId)!, mv = c.movieById.get(a.movieId)!, ch = c.charById.get(a.characterId)!, ac = c.actorById.get(a.actorId)!;
            return (
              <Reveal key={a.id} delay={i * 80}>
                <Link href={`/sunglasses/${m.slug}`} className="card-lift group relative grid min-h-[300px] overflow-hidden rounded-3xl bg-graphite p-8 text-white sm:grid-cols-2">
                  <div className="relative z-10 flex flex-col justify-between">
                    <div><p className="eyebrow !text-champagne">{mv.title} · {mv.year}</p><h3 className="mt-3 font-display text-4xl font-semibold leading-[0.95]">{ac.name} as {ch.name}</h3></div>
                    <div className="mt-6"><p className="text-sm text-white/70">{m.name}</p><div className="mt-3"><MatchBadge type={c.matchOf(a).type} /></div></div>
                  </div>
                  <div className="flex items-center rounded-2xl bg-paper p-4"><GlassesArt shape={m.shape} frame={m.frameColor} lens={m.lensColor} className="w-full transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[-3deg]" /></div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>

      {/* ACTORS */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="On screen" title="Popular Actors" href="/actors" /></Reveal>
        <Reveal><Grid cols={4}>{actors.map((a) => <ActorCard key={a.id} c={c} actor={a} />)}</Grid></Reveal>
      </Container>

      {/* MOVIES */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Film & TV" title="Shop by Movie" href="/movies" /></Reveal>
        <Reveal><Grid cols={4}>{movies.map((m) => <MovieCard key={m.id} c={c} movie={m} />)}</Grid></Reveal>
      </Container>

      {/* STYLES */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Silhouettes" title="Shop by Style" href="/styles" /></Reveal>
        <Reveal>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {STYLES.map((s) => {
              const sample = c.modelsForStyle(s.slug)[0];
              return (
                <li key={s.slug}>
                  <Link href={`/styles/${s.slug}`} className="card-lift flex h-full flex-col items-center rounded-2xl border border-line bg-white p-4 text-center">
                    {sample ? <GlassesArt shape={sample.shape} frame={sample.frameColor} lens={sample.lensColor} className="w-full" /> : <div className="h-16" />}
                    <span className="mt-2 font-display text-xl font-semibold">{s.name}</span>
                    <span className="text-xs text-mist">{c.modelsForStyle(s.slug).length} models</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>

      {/* AFFORDABLE */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Same look, smaller price" title="Affordable Alternatives" href="/affordable-alternatives" /></Reveal>
        <Reveal>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {tiers.map((t) => (
              <Link key={t.band} href={`/affordable-alternatives?budget=${t.band}`} className="card-lift flex items-center justify-between rounded-2xl border border-line bg-white px-6 py-5">
                <span className="font-display text-3xl font-semibold">{PRICE_BAND_LABEL[t.band]}</span><span className="text-sm text-slate">{t.n} picks →</span>
              </Link>
            ))}
          </div>
          <Grid>{budget.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid>
          <p className="mt-4 text-xs text-mist">Budget bands are editorial estimates until live store offers are connected; always confirm the current price at the store.</p>
        </Reveal>
      </Container>

      {/* VINTAGE */}
      <section className="on-dark mt-28 bg-ink py-20 text-white">
        <Container>
          <Reveal><SectionHeading dark eyebrow="Out of production" title="Vintage & Rare Eyewear" href="/vintage" /></Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {vintage.map((m, i) => (
              <Reveal key={m.id} delay={i * 80}>
                <Link href={`/sunglasses/${m.slug}`} className="card-lift group block rounded-2xl border border-white/15 bg-graphite p-6">
                  <GlassesArt shape={m.shape} frame={m.frameColor} lens={m.lensColor} className="mx-auto w-4/5 transition-transform duration-700 group-hover:scale-110" />
                  <p className="eyebrow mt-4">{c.brandById.get(m.brandId)?.name}</p>
                  <h3 className="font-display text-2xl font-semibold">{m.name}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* GUIDES */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Research" title="Latest Guides" href="/blog" /></Reveal>
        <Reveal><Grid>{c.articles.slice(0, 3).map((a) => <ArticleCard key={a.id} a={a} c={c} />)}</Grid></Reveal>
      </Container>

      {/* BRANDS */}
      <Container className="mt-28">
        <Reveal><SectionHeading eyebrow="Makers" title="Featured Brands" href="/brands" /></Reveal>
        <Reveal><Grid cols={4}>{brands.map((b) => <BrandCard key={b.id} c={c} brand={b} />)}</Grid></Reveal>
      </Container>

      {/* METHOD */}
      <Container className="mt-28">
        <Reveal>
          <div className="rounded-3xl border border-line bg-white p-8 sm:p-12">
            <p className="eyebrow mb-3">Our standard</p>
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">Every match is graded by evidence</h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {(Object.keys(MATCH_LABEL) as MatchType[]).map((t) => (
                <div key={t}><dt><MatchBadge type={t} /></dt><dd className="mt-3 text-sm leading-relaxed text-slate">{MATCH_HELP[t]}</dd></div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3"><Link className={btn} href="/about">Read our methodology</Link><Link className={btnGhost} href="/sunglasses">Browse the catalog</Link></div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
