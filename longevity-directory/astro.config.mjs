// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";

import { SITE } from "./src/lib/site.ts";

/**
 * Adapter scelto in base all'ambiente, non a mano: Vercel imposta da sé la
 * variabile VERCEL durante la build (non va impostata manualmente). Così:
 * - `vercel build` in produzione usa l'adapter Vercel (funzioni serverless);
 * - `npm run build` in locale (dove VERCEL non è definita) continua a usare
 *   l'adapter Node standalone, che produce `dist/server/entry.mjs` — lo
 *   stesso eseguibile su cui in questa sessione sono stati fatti tutti i
 *   test end-to-end reali (curl, Playwright) finora. Cambiare adapter non
 *   deve rompere quel flusso di verifica.
 */
const adapter = process.env.VERCEL ? vercel() : node({ mode: "standalone" });

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  // "server": serve le pagine di contenuto come file statici pre-renderizzati
  // (ogni pagina dichiara `export const prerender = true`, vedi CLAUDE.md di
  // questo pacchetto) e tiene dinamiche solo le Actions (form, autenticazione)
  // e le pagine che leggono la sessione per richiesta (/account, /admin, /accedi).
  output: "server",
  adapter,
  security: {
    // Necessario perché il controllo CSRF sulle Actions funzioni affatto:
    // nell'adapter Node (5.18.x / @astrojs/node 9.5.x), senza questa lista
    // l'header Host della richiesta viene scartato anche quando non c'è
    // alcun proxy davanti (perde la porta, "localhost:4321" diventa
    // "localhost"), e il confronto con l'header Origin del browser fallisce
    // sempre con 403 — anche in richieste dirette, senza nulla di
    // cross-site coinvolto. Va aggiornato con il dominio reale in
    // produzione (vedi SITE.url in lib/site.ts).
    allowedDomains: [
      { hostname: SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "") },
      { hostname: "localhost" },
      { hostname: "127.0.0.1" },
    ],
  },
  integrations: [mdx()],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
