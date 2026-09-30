import BlogContent from "@/components/pages/BlogContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog: guide e ricette senza glutine",
  description: "Articoli su celiachia, alimentazione, ricette, viaggi, salute e prodotti senza glutine, scritti da esperti e dalla community italiana dei celiaci.",
  path: "/blog",
  locale: "it",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <BlogContent locale="it" sp={sp} />;
}
