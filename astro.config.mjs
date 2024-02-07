import { defineConfig } from "astro/config";

import astroExpressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { h } from "hastscript";
import { visit } from "unist-util-visit";

import sitemap from "@astrojs/sitemap";

/**
 * Allows for syntax like
 *
 * :::div{.positive}
 * This is a positive message
 * :::
 */
function directiveToHtml() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://blog.val.town",
  integrations: [astroExpressiveCode(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, directiveToHtml],
  },
  editLink: {
    baseUrl: "https://github.com/val-town/val-town-docs/edit/main/",
  },
  server: {
    port: 4322,
  },
});
