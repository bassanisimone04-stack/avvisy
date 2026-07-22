import type { APIRoute } from "astro";
import { SITE } from "../config/site";

/**
 * Genera dinamicamente il file robots.txt usando l'URL del sito
 * definito in src/config/site.ts. Indica anche dove si trova la sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site?.href ?? `${SITE.url}/`;
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", base).href}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
