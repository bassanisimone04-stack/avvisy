import { notFound } from "next/navigation";
import DirectoryContent from "@/components/pages/DirectoryContent";
import { directoryMetadata } from "@/lib/directory-seo";
import { cityFromSlug, cityPageCities, citySlug } from "@/lib/city-pages";

type Params = Promise<{ citta: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return cityPageCities().map((c) => ({ citta: citySlug(c) }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const city = cityFromSlug((await params).citta);
  if (!city) return {};
  return directoryMetadata({ comune: city }, "it");
}

export default async function CityPage({ params }: { params: Params }) {
  const city = cityFromSlug((await params).citta);
  if (!city) notFound();
  return <DirectoryContent locale="it" sp={{ comune: city }} />;
}
