import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { ARTICLES, BLOG_CATEGORIES, blogCategoryLabel } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
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
  const rest = (featured ? articles.filter((a) => a.id !== featured.id) : articles).map((a) => a);
  const blogHref = localeHref(locale, "/blog");
  const featuredLocalized = featured ? getLocalizedArticle(featured, locale) : undefined;

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.nav.blog, path: "/blog" }]} />
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">{t.blog.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t.blog.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={blogHref} className={`chip ${!activeCategory ? "chip-brand" : "chip-neutral"}`}>{t.blog.all}</Link>
        {BLOG_CATEGORIES.map((c) => (
          <Link key={c} href={`${blogHref}?categoria=${slugify(c)}`} className={`chip ${activeCategory === c ? "chip-brand" : "chip-neutral"}`}>
            {blogCategoryLabel(c, locale)}
          </Link>
        ))}
      </div>

      {featuredLocalized && (
        <Link href={localeHref(locale, `/blog/${featuredLocalized.slug}`)} className="card card-hover card-soft mt-8 grid gap-0 overflow-hidden md:grid-cols-2">
          <div className="bg-brand-soft p-8">
            <span className="chip chip-accent">{t.blog.featured} · {blogCategoryLabel(featuredLocalized.category, locale)}</span>
            <h2 className="mt-3 text-2xl font-bold text-ink">{featuredLocalized.title}</h2>
            <p className="mt-2 text-ink-soft">{featuredLocalized.excerpt}</p>
            <p className="mt-4 text-sm font-semibold text-brand-dark">{t.common.readArticle}</p>
          </div>
          <div className="min-h-56 bg-brand-soft/60" />
        </Link>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => <ArticleCard key={a.id} article={a} locale={locale} />)}
      </div>
    </div>
  );
}
