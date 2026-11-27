import { SEGMENTS, renderUrlset, segmentEntries, type Segment } from "@/seo/sitemap-data";

export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ segment: `${s}.xml` }));
}
export async function GET(_: Request, { params }: { params: Promise<{ segment: string }> }) {
  const seg = (await params).segment.replace(/\.xml$/, "") as Segment;
  if (!SEGMENTS.includes(seg)) return new Response("Not found", { status: 404 });
  return new Response(renderUrlset(await segmentEntries(seg)), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
