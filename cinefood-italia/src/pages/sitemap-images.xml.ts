import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getImage } from "astro:assets";
import { SITE } from "../config/site";
import { tFilmTitolo } from "../i18n/content-en";

/**
 * Sitemap immagini dedicata (estensione Google Image Sitemap), separata
 * dalla sitemap principale generata da @astrojs/sitemap: quest'ultima non
 * supporta i tag <image:image>, quindi li generiamo qui a mano per aiutare
 * Google a scoprire/indicizzare le foto di locali, film e articoli.
 * Referenziata in robots.txt accanto alla sitemap-index.xml.
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Entry = { loc: string; images: { url: string; title?: string }[] };

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? `${SITE.url}/`;
  const abs = (p: string) => new URL(p, base).href;
  const imgUrl = async (img: Parameters<typeof getImage>[0]["src"]) =>
    abs((await getImage({ src: img })).src);

  const entries: Entry[] = [];

  // Locali: stessa foto, pagina IT e pagina EN.
  const locali = await getCollection("restaurants");
  for (const l of locali) {
    const url = await imgUrl(l.data.immagine);
    entries.push({ loc: abs(`/locale/${l.id}`), images: [{ url, title: l.data.nome }] });
    entries.push({ loc: abs(`/en/locale/${l.id}`), images: [{ url, title: l.data.nome }] });
    for (const g of l.data.galleria) {
      const gUrl = await imgUrl(g);
      entries[entries.length - 2].images.push({ url: gUrl });
      entries[entries.length - 1].images.push({ url: gUrl });
    }
  }

  // Film: locandina, pagina IT e pagina EN.
  const films = await getCollection("films");
  for (const f of films) {
    const url = await imgUrl(f.data.locandina);
    entries.push({ loc: abs(`/film/${f.id}`), images: [{ url, title: f.data.titolo }] });
    entries.push({ loc: abs(`/en/film/${f.id}`), images: [{ url, title: tFilmTitolo(f, "en") }] });
  }

  // Articoli: solo quelli con immagine, ognuno ha una sola lingua/pagina.
  const blog = await getCollection("blog");
  for (const a of blog) {
    if (!a.data.immagine) continue;
    const url = await imgUrl(a.data.immagine);
    const slug = a.id.replace(/-en$/, "");
    const loc = a.data.lang === "en" ? abs(`/en/blog/${slug}`) : abs(`/blog/${slug}`);
    entries.push({ loc, images: [{ url, title: a.data.titolo }] });
  }

  const body = entries
    .map(
      (e) => `  <url>
    <loc>${esc(e.loc)}</loc>
${e.images
  .map(
    (img) => `    <image:image>
      <image:loc>${esc(img.url)}</image:loc>
${img.title ? `      <image:title>${esc(img.title)}</image:title>\n` : ""}    </image:image>`
  )
  .join("\n")}
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
