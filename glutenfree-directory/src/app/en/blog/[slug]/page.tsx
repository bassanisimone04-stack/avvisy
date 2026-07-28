import type { Metadata } from "next";
import ArticleDetailContent from "@/components/pages/ArticleDetailContent";
import { ARTICLES, getArticleBySlug } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = getArticleBySlug(slug);
  if (!base) return {};
  const article = getLocalizedArticle(base, "en");
  return pageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/blog/${article.slug}`,
    type: "article",
    locale: "en",
  });
}

export default async function ArticlePageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailContent locale="en" slug={slug} />;
}
