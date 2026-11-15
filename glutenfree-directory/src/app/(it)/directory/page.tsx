import DirectoryContent from "@/components/pages/DirectoryContent";
import { directoryMetadata } from "@/lib/directory-seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  return directoryMetadata(await searchParams, "it");
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="it" sp={sp} />;
}
