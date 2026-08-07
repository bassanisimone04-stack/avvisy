import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { getAuthorBySlug, authorBio } from "@/lib/authors";
import { ARTICLES } from "@/lib/mock-articles";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AuthorArchiveContent({ locale, slug }: { locale: Locale; slug: string }) {
  const author = getAuthorBySlug(slug);
  if (!author) notFound();
  const t = getDictionary(locale);
  const articles = ARTICLES.filter((a) => a.author === author.name);

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[
        { name: t.nav.blog, path: "/blog" },
        { name: author.name, path: `/blog/autore/${author.slug}` },
      ]} />

      <div className="card card-soft flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl font-semibold text-brand-dark">
          {author.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
        </span>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{author.name}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{authorBio(author, locale)}</p>
        </div>
      </div>

      <h2 className="mb-5 mt-10 text-xl font-bold text-ink">{t.blog.byAuthor} {author.name} ({articles.length})</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => <ArticleCard key={a.id} article={a} locale={locale} />)}
      </div>
    </div>
  );
}
