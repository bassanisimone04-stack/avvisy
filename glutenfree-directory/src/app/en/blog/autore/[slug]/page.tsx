import type { Metadata } from "next";
import AuthorArchiveContent from "@/components/pages/AuthorArchiveContent";
import { AUTHORS, getAuthorBySlug, authorBio } from "@/lib/authors";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name} — Author at Mappa Senza Glutine`,
    description: authorBio(author, "en"),
    path: `/blog/autore/${author.slug}`,
    locale: "en",
  });
}

export default async function AuthorPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AuthorArchiveContent locale="en" slug={slug} />;
}
