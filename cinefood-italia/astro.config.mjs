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
  // URL SENZA slash finale ovunque (i link interni del sito sono già scritti
  // così, es. /blog/slug): build.format "file" genera .html piatti invece di
  // cartelle con index.html, così ogni pagina ha una sola URL reale, senza
  // bisogno di redirect e senza varianti slash/no-slash indicizzate separatamente.
  trailingSlash: "never",
  build: { format: "file" },
  // Sito bilingue: italiano alla radice, inglese sotto /en/.
  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Genera automaticamente sitemap-index.xml + sitemap-0.xml.
    // Con i18n la sitemap include gli hreflang it/en per ogni pagina.
    sitemap({
      i18n: {
        defaultLocale: "it",
        locales: { it: "it", en: "en" },
      },
    }),
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
