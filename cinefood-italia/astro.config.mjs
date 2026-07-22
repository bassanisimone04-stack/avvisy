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
  integrations: [
    // Genera automaticamente sitemap-index.xml + sitemap-0.xml.
    sitemap(),
    // Permette di scrivere articoli/contenuti in .mdx se serve.
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Consente immagini remote (placeholder) durante lo sviluppo.
    remotePatterns: [{ protocol: "https" }],
  },
});
