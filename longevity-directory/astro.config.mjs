// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import { SITE } from "./src/lib/site.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: "static",
  integrations: [
    sitemap({
      // Esclude dalla sitemap le pagine noindex (evita il segnale contraddittorio
      // "non indicizzarmi" via meta robots + "eccomi, scansionami" via sitemap).
      filter: (page) => !page.includes("/per-i-centri/registrazione") && !page.includes("/404"),
    }),
    mdx(),
  ],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
