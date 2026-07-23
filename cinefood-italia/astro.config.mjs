// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import { SITE } from "./src/config/site.ts";

// https://astro.build/config
export default defineConfig({
  // URL pubblico del sito: usato per sitemap, canonical, Open Graph.
  // ▶️ CAMBIA QUESTO quando pubblichi online (vedi anche src/config/site.ts).
  site: SITE.url,
  // Output statico (SSG) per la massima velocità e SEO.
  output: "static",
  // Sito bilingue: italiano alla radice, inglese sotto /en/.
  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Genera automaticamente sitemap-index.xml + sitemap-0.xml.
    sitemap(),
    // Permette di scrivere articoli/contenuti in .mdx se serve.
    mdx(),
  ],
  vite: {
    // Il cast a `any` evita un falso errore di tipi dovuto alla doppia
    // versione di Vite (quella di Astro e quella di @tailwindcss/vite).
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  image: {
    // Consente immagini remote (placeholder) durante lo sviluppo.
    remotePatterns: [{ protocol: "https" }],
  },
});
