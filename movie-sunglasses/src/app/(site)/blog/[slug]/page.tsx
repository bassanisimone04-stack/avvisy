import Link from "next/link";
import { notFoundOrRedirect } from "@/lib/redirects";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, JsonLd, UnreviewedNotice } from "@/components/ui";
import { Markdown, extractHeadings } from "@/components/markdown";
import { ArticleToc, ReadingProgress, ShareButton } from "@/components/interactive";
import { Grid, ModelCard } from "@/components/cards";
import { ViewBeacon } from "@/components/misc";
import { ArticleRef } from "@/components/tracked-link";

export const revalidate = 300;
export async function generateStaticParams() { return (await getCatalog()).articles.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getCatalog()).articles.find((x) => x.slug === slug);
  return a ? buildMetadata({ title: a.metaTitle || a.title, description: a.metaDescription || a.answer, path: `/blog/${a.slug}`, type: "article", absoluteTitle: !!a.metaTitle }) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const a = c.articles.find((x) => x.slug === slug);
  if (!a) return notFoundOrRedirect(`/blog/${slug}`);
  const models = a.modelIds.map((i) => c.modelById.get(i)).filter((m): m is NonNullable<typeof m> => !!m);
  const toc = [...extractHeadings(a.body), ...(a.faq.length ? [{ id: "faq", text: "FAQ" }] : []), ...(a.sources.length ? [{ id: "src", text: "Sources" }] : [])];
  const movies = a.movieIds.map((i) => c.movieById.get(i)).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Guides", href: "/blog" }, { name: a.title }]} />
      <ViewBeacon type="article" id={a.id} />
      <ArticleRef slug={a.slug} />
      <ReadingProgress />
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,720px)_190px] lg:justify-center">
      <article className="min-w-0">
        <p className="eyebrow mb-3">{a.category}</p>
        <h1 className="font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">{a.title}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 text-sm text-slate"><span>Updated {formatDate(a.updatedAt)} · {a.reviewed ? "Editorially reviewed" : "Awaiting editorial review"}</span><ShareButton title={a.title} /></p>
        <div className="mt-8"><UnreviewedNotice /></div>
        {a.answer && (
          <aside aria-label="Quick answer" className="my-8 rounded-2xl border-l-4 border-champagne bg-white p-6 shadow-sm">
            <p className="eyebrow mb-2">Quick answer</p>
            <p className="text-lg leading-relaxed">{a.answer}</p>
          </aside>
        )}
        <Markdown source={a.body} />
        {a.faq.length > 0 && (
          <section aria-labelledby="faq" className="mt-12">
            <h2 id="faq" className="font-display text-4xl font-semibold">Frequently asked questions</h2>
            <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
              {a.faq.map((f) => <details key={f.q} className="group p-5"><summary className="cursor-pointer font-medium">{f.q}</summary><p className="mt-3 leading-relaxed text-slate">{f.a}</p></details>)}
            </div>
          </section>
        )}
        {a.sources.length > 0 && (
          <section aria-labelledby="src" className="mt-12">
            <h2 id="src" className="font-display text-4xl font-semibold">Sources</h2>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate">{a.sources.map((s) => <li key={s.url}><a className="underline underline-offset-4" href={s.url} rel="nofollow noopener noreferrer" target="_blank">{s.title}<span className="sr-only"> (opens in new tab)</span></a></li>)}</ol>
            <p className="mt-3 text-xs text-mist">Sources reviewed {formatDate(a.updatedAt)}. Retailer blogs have a commercial interest in the products they describe; we weigh them accordingly.</p>
          </section>
        )}
        {movies.length > 0 && <p className="mt-10 text-sm text-slate">Related titles: {movies.map((m, i) => <span key={m.id}>{i > 0 && ", "}<Link className="underline underline-offset-4" href={`/movies/${m.slug}`}>{m.title}</Link></span>)}</p>}
      </article>
      <aside><ArticleToc items={toc} /></aside>
      </div>
      {models.length > 0 && (
        <section aria-labelledby="mentioned" className="mt-16">
          <h2 id="mentioned" className="font-display text-4xl font-semibold">Models in this guide</h2>
          <div className="mt-6"><Grid>{models.map((m) => <ModelCard key={m.id} c={c} m={m} />)}</Grid></div>
        </section>
      )}
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.metaDescription || a.answer, datePublished: a.createdAt, dateModified: a.updatedAt, mainEntityOfPage: `${SITE.url}/blog/${a.slug}`, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name } },
        ...(a.faq.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
      ]} />
    </Container>
  );
}
