import type { Metadata } from "next";
import ArticleDetailContent from "@/components/pages/ArticleDetailContent";
import { ARTICLES, getArticleBySlug } from "@/lib/mock-articles";
import { pageMetadata } from "@/lib/seo";

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
    locale: "it",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailContent locale="it" slug={slug} />;
}
