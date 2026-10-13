// Pagina statica: pre-renderizzata a build time (vedi astro.config.mjs, output:"server").
export const prerender = true;

/**
 * Sitemap scritta a mano, senza `@astrojs/sitemap`: quel pacchetto richiede
 * zod v4, mentre le Astro Actions di questo progetto girano su zod v3
 * (nucleo interno di Astro 5.18) — installarli insieme rompeva silenziosamente
 * ogni Action in produzione ("Right-hand side of 'instanceof' is not an
 * object", vedi il commit che introduce questo file). Niente terze parti,
 * niente rischio che torni.
 *
 * Include solo le pagine indicizzabili: esclude esplicitamente le pagine
 * noindex (/per-i-centri/registrazione, /account, /admin, /accedi, /404) —
 * stesso principio del vecchio `filter` di @astrojs/sitemap.
 */
import { getCollection } from "astro:content";
import { SITE } from "../lib/site";
import { CATEGORIES, getCityPageCombos, getCityOverviewPages } from "../lib/taxonomy";

const STATIC_PAGES = [
  "/",
  "/chi-siamo",
  "/contatti",
  "/directory",
  "/blog",
  "/guide",
  "/per-i-centri",
  "/disclaimer-medico",
  "/privacy",
  "/cookie",
  "/termini",
];

export async function GET() {
  const centri = await getCollection("centri");
  const posts = await getCollection("blog");
  const guide = await getCollection("guide");
  const combos = getCityPageCombos(centri);
  const cityPages = getCityOverviewPages(centri);

  const urls: { loc: string; lastmod?: string }[] = [
    ...STATIC_PAGES.map((p) => ({ loc: p })),
    ...CATEGORIES.map((c) => ({ loc: `/directory/${c.slug}` })),
    ...combos.map((combo) => ({ loc: `/directory/${combo.categoria}/${combo.cittaSlug}` })),
    ...cityPages.map((c) => ({ loc: `/citta/${c.cittaSlug}` })),
    ...centri.map((c) => ({ loc: `/centri/${c.id}`, lastmod: c.data.dataAggiunta.toISOString() })),
    ...posts.map((p) => ({
      loc: `/blog/${p.id}`,
      lastmod: (p.data.dataAggiornamento ?? p.data.dataPubblicazione).toISOString(),
    })),
    ...guide.map((g) => ({
      loc: `/guide/${g.id}`,
      lastmod: (g.data.dataAggiornamento ?? g.data.dataPubblicazione).toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${new URL(u.loc, SITE.url).toString()}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
