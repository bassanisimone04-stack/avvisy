import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CalendarDays, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlaceholderImage from "@/components/PlaceholderImage";
import TableOfContents from "@/components/TableOfContents";
import FaqAccordion from "@/components/FaqAccordion";
import ArticleCard from "@/components/ArticleCard";
import SocialShare from "@/components/SocialShare";
import CommentsSection from "@/components/CommentsSection";
import { ARTICLES, getArticleBySlug, getRelatedArticles } from "@/lib/mock-articles";
import { formatDateIt } from "@/lib/format";
import { JsonLd, articleJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/blog/${article.slug}`,
    type: "article",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const url = `${SITE_URL}/blog/${article.slug}`;

  return (
    <div className="container-page py-10">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqJsonLd(article.faqs)} />

      <Breadcrumbs items={[
        { name: "Blog", path: "/blog" },
        { name: article.category, path: `/blog?categoria=${article.category.toLowerCase()}` },
        { name: article.title, path: `/blog/${article.slug}` },
      ]} />

      <div className="mx-auto max-w-3xl">
        <span className="chip chip-accent">{article.category}</span>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{article.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-line py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
              {article.author.split(" ").map((p) => p[0]).join("")}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{article.author}</p>
              <p className="text-xs text-muted">{article.authorRole}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDateIt(article.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readingTime} min di lettura</span>
          </div>
        </div>

        <PlaceholderImage seed={article.coverSeed} variant="default" ratio="aspect-[16/9]" className="mt-6 rounded-2xl" label={article.title} />
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[1fr_260px]">
        <article className="prose-article max-w-3xl" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

        <div className="hidden lg:block">
          <TableOfContents headings={article.headings} />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((t) => <span key={t} className="chip chip-neutral">#{t}</span>)}
          </div>
          <SocialShare url={url} title={article.title} />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-ink">Domande frequenti</h2>
          <FaqAccordion items={article.faqs} />
        </div>

        <div className="card card-soft flex flex-col items-center gap-3 p-8 text-center">
          <h2 className="text-xl font-bold text-ink">Cerchi un locale sicuro vicino a te?</h2>
          <p className="max-w-md text-ink-soft">Scopri la nostra directory di ristoranti, negozi e hotel certificati per una vita senza glutine più semplice.</p>
          <Link href="/directory" className="btn btn-primary">Esplora la directory <ArrowRight size={16} /></Link>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-ink">Articoli correlati</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.id} article={a} compact />)}
            </div>
          </div>
        )}

        <CommentsSection comments={article.comments} />
      </div>
    </div>
  );
}
