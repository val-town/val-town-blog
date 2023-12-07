import { defineConfig } from "astro/config";

import astroExpressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [astroExpressiveCode(), mdx(), sitemap()],
});
