import { getCatalog } from "@/lib/catalog";
import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Sunglasses worn in a movie";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mv = (await getCatalog()).movies.find((x) => x.slug === slug);
  return ogCard({ eyebrow: mv ? `${mv.kind === "series" ? "TV series" : "Film"} · ${mv.year}` : "Movies", title: mv ? `${mv.title} sunglasses` : "Screenshade" });
}
