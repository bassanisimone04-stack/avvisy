import { getCatalog } from "@/lib/catalog";
import { MATCH_LABEL } from "@/lib/site";
import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Screenshade identification card: movie sunglasses with evidence grade";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const m = c.models.find((x) => x.slug === slug);
  if (!m) return ogCard({ eyebrow: "Sunglasses", title: "Screenshade" });
  const films = [...new Set(c.appsForModel(m.id).map((a) => c.movieById.get(a.movieId)?.title))].filter(Boolean);
  return ogCard({ eyebrow: films.length ? `As seen in ${films[0]}` : "Look-alike", title: m.name, footer: MATCH_LABEL[c.modelMatch(m.id)] });
}
