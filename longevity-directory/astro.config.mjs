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
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
