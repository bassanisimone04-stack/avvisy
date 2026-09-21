import BlogContent from "@/components/pages/BlogContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog: gluten-free guides and recipes",
  description: "Articles on celiac disease, nutrition, recipes, travel, health and gluten-free products, written by experts and Italy's celiac community.",
  path: "/blog",
  locale: "en",
});

export default async function BlogPageEn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <BlogContent locale="en" sp={sp} />;
}
