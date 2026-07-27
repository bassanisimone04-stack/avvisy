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
import { getArticleBySlug, getRelatedArticles, blogCategoryLabel } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
import { formatDate, slugify } from "@/lib/format";
import { JsonLd, articleJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function ArticleDetailContent({ locale, slug }: { locale: Locale; slug: string }) {
  const base = getArticleBySlug(slug);
  if (!base) notFound();
  const article = getLocalizedArticle(base, locale);
  const t = getDictionary(locale);

  const related = getRelatedArticles(base);
  const url = `${SITE_URL}${localeHref(locale, `/blog/${article.slug}`)}`;
  const blogHref = localeHref(locale, "/blog");

  return (
    <div className="container-page py-10">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqJsonLd(article.faqs)} />

      <Breadcrumbs locale={locale} items={[
        { name: t.nav.blog, path: "/blog" },
        { name: blogCategoryLabel(article.category, locale), path: `/blog?categoria=${slugify(article.category)}` },
        { name: article.title, path: `/blog/${article.slug}` },
      ]} />

      <div className="mx-auto max-w-3xl">
        <span className="chip chip-accent">{blogCategoryLabel(article.category, locale)}</span>
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
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(article.publishedAt, locale)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readingTime} {t.blog.readingTime}</span>
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
            {article.tags.map((tag) => <span key={tag} className="chip chip-neutral">#{tag}</span>)}
          </div>
          <SocialShare url={url} title={article.title} />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-ink">{t.blog.faqTitle}</h2>
          <FaqAccordion items={article.faqs} />
        </div>

        <div className="card card-soft flex flex-col items-center gap-3 p-8 text-center">
          <h2 className="text-xl font-bold text-ink">{t.blog.ctaTitle}</h2>
          <p className="max-w-md text-ink-soft">{t.blog.ctaBody}</p>
          <Link href={localeHref(locale, "/directory")} className="btn btn-primary">{t.blog.ctaButton} <ArrowRight size={16} /></Link>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-ink">{t.blog.relatedTitle}</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.id} article={a} compact locale={locale} />)}
            </div>
          </div>
        )}

        <CommentsSection comments={article.comments} />
      </div>
    </div>
  );
}
