import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { ARTICLES, BLOG_CATEGORIES } from "@/lib/mock-articles";
import { slugify } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog: guide, ricette e news sulla celiachia e il senza glutine",
  description: "Articoli su celiachia, alimentazione, ricette, viaggi, salute e prodotti senza glutine, scritti da esperti e dalla community italiana dei celiaci.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const categoriaSlug = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const activeCategory = BLOG_CATEGORIES.find((c) => slugify(c) === categoriaSlug);
  const articles = activeCategory ? ARTICLES.filter((a) => a.category === activeCategory) : ARTICLES;
  const featured = !activeCategory ? ARTICLES.find((a) => a.featured) : undefined;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">Blog GlutenFree Directory</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Guide pratiche, ricette e approfondimenti su celiachia e alimentazione senza glutine, aggiornati regolarmente dal nostro team editoriale.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/blog" className={`chip ${!activeCategory ? "chip-brand" : "chip-neutral"}`}>Tutti</Link>
        {BLOG_CATEGORIES.map((c) => (
          <Link key={c} href={`/blog?categoria=${slugify(c)}`} className={`chip ${activeCategory === c ? "chip-brand" : "chip-neutral"}`}>
            {c}
          </Link>
        ))}
      </div>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="card card-hover card-soft mt-8 grid gap-0 overflow-hidden md:grid-cols-2">
          <div className="bg-brand-soft p-8">
            <span className="chip chip-accent">In evidenza · {featured.category}</span>
            <h2 className="mt-3 text-2xl font-bold text-ink">{featured.title}</h2>
            <p className="mt-2 text-ink-soft">{featured.excerpt}</p>
            <p className="mt-4 text-sm font-semibold text-brand-dark">Leggi l&apos;articolo →</p>
          </div>
          <div className="min-h-56 bg-brand-soft/60" />
        </Link>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}
