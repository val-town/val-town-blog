import { defineConfig } from "astro/config";

import astroExpressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.val.town",
  integrations: [astroExpressiveCode(), mdx(), sitemap()],
  editLink: {
    baseUrl: "https://github.com/val-town/val-town-docs/edit/main/",
  },
  server: {
    port: 4322,
  },
});
