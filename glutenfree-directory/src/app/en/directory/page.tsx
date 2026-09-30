import DirectoryContent from "@/components/pages/DirectoryContent";
import { directoryMetadata } from "@/lib/directory-seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  return directoryMetadata(await searchParams, "en");
}

export default async function DirectoryPageEn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="en" sp={sp} />;
}
