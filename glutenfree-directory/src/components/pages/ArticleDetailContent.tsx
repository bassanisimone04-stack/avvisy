import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CalendarDays, ArrowRight, Quote, List, ChevronDown } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlaceholderImage from "@/components/PlaceholderImage";
import TableOfContents from "@/components/TableOfContents";
import FaqAccordion from "@/components/FaqAccordion";
import ArticleCard from "@/components/ArticleCard";
import SocialShare from "@/components/SocialShare";
import CommentsSection from "@/components/CommentsSection";
import ReadingProgress from "@/components/ReadingProgress";
import KeyTakeaways from "@/components/KeyTakeaways";
import { getArticleBySlug, getRelatedArticles, blogCategoryLabel } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
import { getCategoryTheme, categoryThemeClass } from "@/lib/blog-theme";
import { getAuthorByName, authorBio } from "@/lib/authors";
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
  const theme = getCategoryTheme(base.category);

  const related = getRelatedArticles(base);
  const url = `${SITE_URL}${localeHref(locale, `/blog/${article.slug}`)}`;
  const author = getAuthorByName(article.author);

  return (
    <div className={categoryThemeClass(base.category)}>
      <ReadingProgress />
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqJsonLd(article.faqs)} />

      <div className="container-page pt-6">
        <Breadcrumbs locale={locale} items={[
          { name: t.nav.blog, path: "/blog" },
          { name: blogCategoryLabel(article.category, locale), path: `/blog?categoria=${slugify(article.category)}` },
          { name: article.title, path: `/blog/${article.slug}` },
        ]} />
      </div>

      {/* HERO EDITORIALE */}
      <section className="editorial-hero">
        <div className="container-page relative grid gap-10 py-10 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="editorial-kicker text-base">{blogCategoryLabel(article.category, locale)}</span>
            <h1 className="font-editorial mt-3 text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-[3.2rem]">{article.title}</h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">{article.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-sm font-semibold text-ink shadow-sm">
                  {article.author.split(" ").map((p) => p[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{article.author}</p>
                  <p className="text-xs text-muted">{article.authorRole}</p>
                </div>
              </div>
              <span className="hidden h-8 w-px bg-line sm:block" />
              <span className="flex items-center gap-1.5 text-sm text-ink-soft"><CalendarDays size={14} /> {formatDate(article.publishedAt, locale)}</span>
              <span className="flex items-center gap-1.5 text-sm text-ink-soft"><Clock size={14} /> {article.readingTime} {t.blog.readingTime}</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <PlaceholderImage
              seed={article.coverSeed}
              variant="default"
              ratio="aspect-square"
              className="rounded-[2rem] shadow-lg"
              label={article.title}
              tint={{ soft: theme.soft, accent: theme.accent, bg1: theme.soft, bg2: theme.soft }}
            />
          </div>
        </div>
      </section>

      <div className="container-page">
        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_260px]">
          <div className="max-w-3xl">
            {article.headings.length > 0 && (
              <details className="group mb-6 lg:hidden">
                <summary className="card card-soft flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-ink">
                  <span className="flex items-center gap-2">
                    <List size={16} style={{ color: "var(--article-accent)" }} />
                    {t.blog.tocTitle}
                  </span>
                  <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2">
                  <TableOfContents headings={article.headings} accent="var(--article-accent)" sticky={false} hideTitle />
                </div>
              </details>
            )}
            <KeyTakeaways items={article.keyTakeaways} title={t.blog.keyTakeaways} />
            <article className="editorial prose-article" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          </div>

          <div className="hidden lg:block">
            <TableOfContents headings={article.headings} accent="var(--article-accent)" />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-10 pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} href={`${localeHref(locale, "/blog")}?tag=${encodeURIComponent(tag)}`} className="chip" style={{ background: "var(--article-soft)", color: "var(--article-accent)" }}>#{tag}</Link>
              ))}
            </div>
            <SocialShare url={url} title={article.title} />
          </div>

          <div className="card card-soft flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold" style={{ background: "var(--article-soft)", color: "var(--article-accent)" }}>
              {article.author.split(" ").map((p) => p[0]).join("")}
            </span>
            <div>
              <p className="font-semibold text-ink">{article.author}</p>
              <p className="text-sm text-muted">{article.authorRole}</p>
              {author && <p className="mt-2 text-sm text-ink-soft">{authorBio(author, locale)}</p>}
              {author && (
                <Link href={localeHref(locale, `/blog/autore/${author.slug}`)} className="mt-2 inline-block text-sm font-semibold" style={{ color: "var(--article-accent)" }}>
                  {t.blog.viewProfile}
                </Link>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
              <Quote size={18} style={{ color: "var(--article-accent)" }} /> {t.blog.faqTitle}
            </h2>
            <FaqAccordion items={article.faqs} />
          </div>

          <div className="card card-soft flex flex-col items-center gap-3 p-8 text-center" style={{ background: "var(--article-soft)" }}>
            <h2 className="text-xl font-bold text-ink">{t.blog.ctaTitle}</h2>
            <p className="max-w-md text-ink-soft">{t.blog.ctaBody}</p>
            <Link href={localeHref(locale, "/directory")} className="btn text-white" style={{ background: "var(--article-accent-solid, var(--article-accent))" }}>{t.blog.ctaButton} <ArrowRight size={16} /></Link>
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
    </div>
  );
}
