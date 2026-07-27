import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import PlaceholderImage from "@/components/PlaceholderImage";
import { ARTICLES, BLOG_CATEGORIES, blogCategoryLabel } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
import { getCategoryTheme, categoryThemeClass } from "@/lib/blog-theme";
import { slugify } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function BlogContent({
  locale,
  sp,
}: {
  locale: Locale;
  sp: Record<string, string | string[] | undefined>;
}) {
  const t = getDictionary(locale);
  const categoriaSlug = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const activeCategory = BLOG_CATEGORIES.find((c) => slugify(c) === categoriaSlug);
  const articles = activeCategory ? ARTICLES.filter((a) => a.category === activeCategory) : ARTICLES;
  const featured = !activeCategory ? ARTICLES.find((a) => a.featured) : undefined;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;
  const blogHref = localeHref(locale, "/blog");
  const featuredLocalized = featured ? getLocalizedArticle(featured, locale) : undefined;
  const featuredTheme = featured ? getCategoryTheme(featured.category) : undefined;

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.nav.blog, path: "/blog" }]} />
      <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">{t.blog.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t.blog.subtitle}</p>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link href={blogHref} className={`chip ${!activeCategory ? "chip-brand" : "chip-neutral"}`}>{t.blog.all}</Link>
        {BLOG_CATEGORIES.map((c) => {
          const active = activeCategory === c;
          return (
            <Link
              key={c}
              href={`${blogHref}?categoria=${slugify(c)}`}
              className={`chip transition-shadow ${categoryThemeClass(c)}`}
              style={{
                background: "var(--article-soft)",
                color: "var(--article-accent)",
                boxShadow: active ? "0 0 0 1.5px var(--article-accent)" : "none",
              }}
            >
              {blogCategoryLabel(c, locale)}
            </Link>
          );
        })}
      </div>

      {featuredLocalized && featuredTheme && (
        <Link href={localeHref(locale, `/blog/${featuredLocalized.slug}`)} className={`card card-hover card-soft mt-8 grid gap-0 overflow-hidden md:grid-cols-2 ${categoryThemeClass(featured!.category)}`}>
          <div className="p-8 sm:p-10" style={{ background: "var(--article-soft)" }}>
            <span className="chip" style={{ background: "rgba(255,255,255,0.6)", color: "var(--article-accent)" }}>{t.blog.featured} · {blogCategoryLabel(featuredLocalized.category, locale)}</span>
            <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">{featuredLocalized.title}</h2>
            <p className="mt-3 text-ink-soft">{featuredLocalized.excerpt}</p>
            <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--article-accent)" }}>{t.common.readArticle} <ArrowRight size={14} /></p>
          </div>
          <PlaceholderImage
            seed={featuredLocalized.coverSeed}
            variant="default"
            ratio="aspect-[4/3]"
            className="min-h-56"
            label={featuredLocalized.title}
            tint={{ soft: featuredTheme.soft, accent: featuredTheme.accent, bg1: featuredTheme.soft, bg2: featuredTheme.soft }}
          />
        </Link>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => <ArticleCard key={a.id} article={a} locale={locale} />)}
      </div>
    </div>
  );
}
