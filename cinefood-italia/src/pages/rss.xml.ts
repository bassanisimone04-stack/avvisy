import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../config/site";

/** Feed RSS 2.0 del blog italiano (senza dipendenze esterne). */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? `${SITE.url}/`;
  const posts = (await getCollection("blog"))
    .filter((a) => !a.data.bozza && a.data.lang === "it")
    .sort((a, b) => b.data.dataPubblicazione.getTime() - a.data.dataPubblicazione.getTime());

  const items = posts
    .map((p) => {
      const url = new URL(`/blog/${p.id}`, base).href;
      return `    <item>
      <title>${esc(p.data.titolo)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${p.data.dataPubblicazione.toUTCString()}</pubDate>
      <description>${esc(p.data.descrizione)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — Blog</title>
    <link>${new URL("/blog", base).href}</link>
    <atom:link href="${new URL("/rss.xml", base).href}" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.description)}</description>
    <language>it-IT</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
