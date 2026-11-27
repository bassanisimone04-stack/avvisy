import { SITE_URL } from "@/config/brand";
import { LOCALES } from "@/i18n";
import { getDataset } from "@/db/repository";
import { collections } from "@/data/collections";
import { collectionMembers, isVerified } from "@/db/queries";
import { passesQualityGate } from "./indexable-facets";
import { getRates } from "@/lib/fx";
import { SITE } from "@/config/site";
import { t } from "@/db/types";
import { imageSrc } from "@/components/media/SmartImage";
import { BUSINESS, LEGAL, STATIC } from "@/data/pages";

export type SitemapEntry = { path: string; lastmod: string; images?: { loc: string; title: string }[] };
export const SEGMENTS = ["pages", "restaurants", "cities", "collections", "hotels", "experiences", "articles", "chefs", "travel"] as const;
export type Segment = (typeof SEGMENTS)[number];

/** Only indexable, canonical URLs (path WITHOUT locale prefix). Every URL is emitted per locale with alternates. */
export async function segmentEntries(seg: Segment): Promise<SitemapEntry[]> {
  const d = await getDataset();
  const today = new Date().toISOString().slice(0, 10);
  const lm = (r: { lastVerifiedAt?: string; updatedAt: string }) => r.lastVerifiedAt ?? r.updatedAt;
  switch (seg) {
    case "pages":
      return ["/", "/restaurants/", "/destinations/", "/hotels/", "/experiences/", "/travel/", "/magazine/", "/price-index/", "/gifts/", "/club/", "/collections/", "/chefs/", "/business/", "/concierge/", "/contact/",
        ...STATIC.map((p) => `/${p.slug}/`), ...LEGAL.map((p) => `/legal/${p.slug}/`), ...BUSINESS.map((p) => `/business/${p.slug}/`)].map((path) => ({ path, lastmod: today }));
    case "restaurants":
      return d.restaurants.map((r) => ({ path: `/restaurant/${r.slug}/`, lastmod: lm(r), images: r.images.filter((i) => !i.illustrative).map((i) => ({ loc: `${SITE_URL}${imageSrc(i.key).src}`, title: r.name })) }));
    case "cities": {
      const out: SitemapEntry[] = [];
      for (const c of d.cities) {
        const verified = d.restaurants.filter((r) => r.citySlug === c.slug && isVerified(r));
        if (passesQualityGate(verified.length, !!t(c.intro, "en"))) out.push({ path: `/restaurants/${c.countrySlug}/${c.slug}/`, lastmod: verified.map(lm).sort().at(-1) ?? today });
        // whitelisted facet: city + cuisine with enough verified results
        for (const cu of new Set(verified.flatMap((r) => r.cuisines))) if (verified.filter((r) => r.cuisines.includes(cu)).length >= SITE.facetMinResults) out.push({ path: `/restaurants/${c.countrySlug}/${c.slug}/?cuisine=${cu}`, lastmod: today });
      }
      for (const co of d.countries) { const v = d.restaurants.filter((r) => r.countrySlug === co.slug && isVerified(r)); if (v.length >= SITE.destinationMinVerified) out.push({ path: `/restaurants/${co.slug}/`, lastmod: v.map(lm).sort().at(-1) ?? today }); }
      return out;
    }
    case "collections": {
      const rates = await getRates();
      return collections.filter((c) => collectionMembers(d, c, rates).length >= SITE.facetMinResults).map((c) => ({ path: `/collections/${c.slug}/`, lastmod: today }));
    }
    case "hotels": return d.hotels.map((h) => ({ path: `/hotel/${h.slug}/`, lastmod: lm(h) }));
    case "experiences": return d.experiences.map((x) => ({ path: `/experience/${x.slug}/`, lastmod: lm(x) }));
    case "articles": return d.articles.map((a) => ({ path: `/magazine/${a.slug}/`, lastmod: a.updatedAt }));
    case "chefs": return d.chefs.map((c) => ({ path: `/chefs/${c.slug}/`, lastmod: c.updatedAt }));
    case "travel": return d.itineraries.map((i) => ({ path: `/travel/${i.slug}/`, lastmod: i.updatedAt }));
  }
}

const xmlEsc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries.flatMap((e) => LOCALES.map((l) => {
    const alts = [...LOCALES.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${xmlEsc(`${SITE_URL}/${a}${e.path}`)}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(`${SITE_URL}/en${e.path}`)}"/>`].join("");
    const imgs = (e.images ?? []).map((i) => `<image:image><image:loc>${xmlEsc(i.loc)}</image:loc><image:title>${xmlEsc(i.title)}</image:title></image:image>`).join("");
    return `<url><loc>${xmlEsc(`${SITE_URL}/${l}${e.path}`)}</loc><lastmod>${e.lastmod}</lastmod>${alts}${imgs}</url>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join("")}</urlset>`;
}
