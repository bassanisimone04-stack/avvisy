// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

import { SITE } from "./src/lib/site.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  // "server" con adapter Node: serve le pagine di contenuto come file statici
  // pre-renderizzati (ogni pagina dichiara `export const prerender = true`,
  // vedi CLAUDE.md di questo pacchetto) e tiene dinamiche solo le Actions
  // (form, autenticazione) e le pagine che leggono la sessione per richiesta
  // (/account, /admin, /accedi).
  output: "server",
  adapter: node({ mode: "standalone" }),
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
