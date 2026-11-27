import { SITE_URL } from "@/config/brand";
import { SEGMENTS, segmentEntries } from "@/seo/sitemap-data";

export const revalidate = 3600;
/** Sitemap index pointing at segmented sitemaps. */
export async function GET() {
  const items = await Promise.all(SEGMENTS.map(async (s) => ({ s, lastmod: (await segmentEntries(s)).map((e) => e.lastmod).sort().at(-1) })));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.filter((i) => i.lastmod).map((i) => `<sitemap><loc>${SITE_URL}/sitemaps/${i.s}.xml</loc><lastmod>${i.lastmod}</lastmod></sitemap>`).join("")}</sitemapindex>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
