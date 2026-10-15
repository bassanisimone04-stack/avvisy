import Link from "next/link";
import { notFoundOrRedirect } from "@/lib/redirects";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE, MATCH_HELP, PRICE_BAND_LABEL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { modelSeo } from "@/lib/seo-copy";
import { formatDate } from "@/lib/format";
import { GlassesArt } from "@/components/glasses";
import { Breadcrumbs, Container, JsonLd, MatchBadge, UnreviewedNotice, btn } from "@/components/ui";
import { ArticleCard, Grid, ModelCard } from "@/components/cards";
import { PriceTable } from "@/components/price-table";
import { ViewBeacon } from "@/components/misc";
import { StickyModelBar } from "@/components/interactive";

export const revalidate = 600;
export async function generateStaticParams() { return (await getCatalog()).models.map((m) => ({ slug: m.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCatalog();
  const m = c.models.find((x) => x.slug === slug);
  if (!m) return {};
  const seo = modelSeo(c, m);
  return buildMetadata({ title: seo.title, description: seo.description, path: `/sunglasses/${m.slug}`, absoluteTitle: true });
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const m = c.models.find((x) => x.slug === slug);
  if (!m) return notFoundOrRedirect(`/sunglasses/${slug}`);
  const brand = c.brandById.get(m.brandId);
  const faq = modelSeo(c, m).faq;
  const apps = c.appsForModel(m.id);
  const alts = c.alternativesOf(m.id);
  const originals = c.originalsOf(m.id);
  const offers = c.offersFor(m.id).filter((o) => o.price != null);
  const { band, source } = c.priceBandOf(m);
  const articles = c.articlesForModel(m.id);
  const photos = c.approvedPhotos(m.id);
  const related = (() => {
    const seen = new Set([m.id, ...alts.map((x) => x.model.id)]);
    const pool = [
      ...apps.flatMap((a) => c.modelsForMovie(a.movieId)),
      ...apps.flatMap((a) => c.modelsForActor(a.actorId)),
      ...c.modelsForBrand(m.brandId),
      ...c.models.filter((x) => x.shape === m.shape),
    ];
    return pool.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true))).slice(0, 3);
  })();
  const match = c.modelMatch(m.id);
  const bandGroups = (["under50", "under100", "under200", "over200"] as const)
    .map((b) => ({ b, items: alts.filter((x) => c.priceBandOf(x.model).band === b) })).filter((g) => g.items.length);
  const unrated = alts.filter((x) => !c.priceBandOf(x.model).band);

  const specs = [
    ["Brand", brand?.name], ["Reference", m.modelCode], ["Shape", m.shape], ["Frame colour", m.frameColor], ["Lens colour", m.lensColor],
    ["Status", { in_production: "In production", discontinued: "Discontinued", vintage: "Vintage", unknown: "Availability unverified" }[m.status]],
    ...m.specs.map((s) => [s.label, s.value]),
  ].filter(([, v]) => v) as [string, string][];

  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Sunglasses", href: "/sunglasses" }, { name: brand?.name ?? "Brand", href: brand ? `/brands/${brand.slug}` : undefined }, { name: m.name }]} />
      <ViewBeacon type="model" id={m.id} />
      <StickyModelBar id={m.id} name={m.name} />
      <div id="model-hero" className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#ebe8df] p-10 ring-1 ring-line">
            {photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0].url} alt={photos[0].alt} className="h-full w-full object-contain" />
            ) : (
              <GlassesArt shape={m.shape} frame={m.frameColor} lens={m.lensColor} title={`Illustration of ${m.name}`} className="w-full" />
            )}
          </div>
          <p className="mt-2 text-xs text-mist">
            {photos[0] ? `Photo: ${photos[0].credit} · ${photos[0].license}` : "Illustration generated from the model’s recorded shape and colours — not a product photograph. Authorised photography is added by our editors."}
          </p>
        </div>
        <div>
          <p className="eyebrow">{brand?.name}</p>
          <h1 className="font-display mt-2 text-5xl font-semibold leading-[0.95] sm:text-6xl">{m.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3"><MatchBadge type={match} title /><span className="text-sm text-slate">{MATCH_HELP[match]}</span></div>
          <p className="mt-6 text-lg leading-relaxed text-slate">{m.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
            {specs.map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-widest text-mist">{k}</dt><dd className="mt-0.5 first-letter:uppercase font-medium">{v}</dd></div>)}
            <div><dt className="text-xs uppercase tracking-widest text-mist">Price band</dt><dd className="mt-0.5 font-medium">{band ? PRICE_BAND_LABEL[band] : "Not rated"}{band && source === "editorial" && <span className="font-normal text-slate"> (editorial estimate)</span>}</dd></div>
            <div><dt className="text-xs uppercase tracking-widest text-mist">Last verified</dt><dd className="mt-0.5 font-medium">{m.verifiedAt ? formatDate(m.verifiedAt) : "Pending"}</dd></div>
          </dl>
          <a href="#deals" className={`${btn} mt-8`}>Compare prices ↓</a>
        </div>
      </div>

      <div className="mt-10"><UnreviewedNotice /></div>

      <section aria-labelledby="seen-in" className="mt-6">
        <h2 id="seen-in" className="font-display text-4xl font-semibold">{apps.length ? "Seen in" : "About this model"}</h2>
        {apps.length === 0 && (
          <p className="mt-3 max-w-2xl text-slate">This is a purchasable alternative rather than a pair seen on screen.{originals.length > 0 && " It is recommended as a similar style to:"}</p>
        )}
        {originals.length > 0 && (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">{originals.map(({ alt, model }) => (
            <li key={alt.id} className="rounded-xl border border-line bg-white p-4 text-sm"><Link className="font-display text-xl font-semibold underline-offset-4 hover:underline" href={`/sunglasses/${model.slug}`}>{model.name}</Link><p className="mt-1 text-slate">{alt.reason}</p></li>
          ))}</ul>
        )}
        <div className="mt-6 space-y-6">
          {apps.map((a) => {
            const mv = c.movieById.get(a.movieId)!, ac = c.actorById.get(a.actorId)!, ch = c.charById.get(a.characterId)!;
            const em = c.matchOf(a);
            const ev = c.evByApp.get(a.id) ?? [];
            return (
              <article key={a.id} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl font-semibold"><Link className="hover:underline" href={`/movies/${mv.slug}`}>{mv.title}</Link> <span className="text-xl text-mist">({mv.year})</span></h3>
                    <p className="mt-1 text-slate"><Link className="underline-offset-4 hover:underline" href={`/actors/${ac.slug}`}>{ac.name}</Link> as {ch.name}</p>
                  </div>
                  <MatchBadge type={em.type} title />
                </div>
                {a.notes && <p className="mt-4 leading-relaxed text-slate">{a.notes}</p>}
                {em.downgraded && <p className="mt-3 rounded-lg bg-paper px-4 py-3 text-sm text-slate"><strong className="text-ink">Why Unconfirmed?</strong> Editorially proposed as “{a.matchType === "official_reissue" ? "Official Reissue" : "Exact Match"}”, but {em.reason.toLowerCase()}</p>}
                <details className="group mt-5" open={ev.length > 0 && ev.length <= 3}>
                  <summary className="cursor-pointer text-sm font-medium text-champagne-text">Sources & verification ({ev.length})</summary>
                  <ul className="mt-3 space-y-3 text-sm">
                    {ev.map((e) => (
                      <li key={e.id} className="border-l-2 border-line pl-4">
                        <a className="font-medium underline-offset-4 hover:underline" href={e.sourceUrl} rel="nofollow noopener noreferrer" target="_blank">{e.sourceTitle}<span className="sr-only"> (opens in new tab)</span></a>
                        <p className="text-slate">{e.supports}</p>
                        <p className="text-xs text-mist">{e.sourceType.replace("_", " ")} · checked {formatDate(e.checkedAt)}{e.stance === "disputes" && <span className="ml-2 rounded bg-ink px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-white">Disputes</span>}</p>
                      </li>
                    ))}
                    {ev.length === 0 && <li className="text-slate">No sources recorded yet.</li>}
                  </ul>
                </details>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-14"><PriceTable c={c} m={m} src={`model:${m.slug}`} /></div>

      {alts.length > 0 && (
        <section aria-labelledby="alts" className="mt-16">
          <h2 id="alts" className="font-display text-4xl font-semibold">Affordable alternatives</h2>
          <p className="mt-2 max-w-2xl text-slate">Visually similar options — not what was worn on screen. Price bands are editorial estimates until live offers are connected.</p>
          {bandGroups.map((g) => (
            <div key={g.b} className="mt-8"><h3 className="eyebrow mb-4">{PRICE_BAND_LABEL[g.b]}</h3>
              <Grid>{g.items.map(({ model, alt }) => (<div key={alt.id}><ModelCard c={c} m={model} /><p className="mt-2 px-1 text-xs text-slate">{alt.reason}</p></div>))}</Grid></div>
          ))}
          {unrated.length > 0 && <div className="mt-8"><h3 className="eyebrow mb-4">Price not rated</h3><Grid>{unrated.map(({ model, alt }) => (<div key={alt.id}><ModelCard c={c} m={model} /><p className="mt-2 px-1 text-xs text-slate">{alt.reason}</p></div>))}</Grid></div>}
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="more" className="mt-16">
          <h2 id="more" className="font-display text-4xl font-semibold">More movie sunglasses</h2>
          <div className="mt-6"><Grid>{related.map((x) => <ModelCard key={x.id} c={c} m={x} />)}</Grid></div>
        </section>
      )}

      <section aria-labelledby="faq" className="mt-16">
        <h2 id="faq" className="font-display text-4xl font-semibold">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
          {faq.map((f) => <details key={f.q} className="p-5"><summary className="cursor-pointer font-medium">{f.q}</summary><p className="mt-3 leading-relaxed text-slate">{f.a}</p></details>)}
        </div>
      </section>

      {articles.length > 0 && (
        <section aria-labelledby="rel" className="mt-16"><h2 id="rel" className="font-display text-4xl font-semibold">Related guides</h2>
          <div className="mt-6"><Grid>{articles.map((a) => <ArticleCard key={a.id} a={a} c={c} />)}</Grid></div></section>
      )}

      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Product", name: m.name, description: m.description,
        brand: brand ? { "@type": "Brand", name: brand.name } : undefined, mpn: m.modelCode, color: m.frameColor, url: `${SITE.url}/sunglasses/${m.slug}`,
        ...(photos[0] ? { image: photos.map((p) => p.url) } : {}),
        ...(offers.length ? { offers: { "@type": "AggregateOffer", priceCurrency: offers[0].currency, lowPrice: Math.min(...offers.map((o) => o.price!)), highPrice: Math.max(...offers.map((o) => o.price!)), offerCount: offers.length } } : {}),
      }} />
    </Container>
  );
}
