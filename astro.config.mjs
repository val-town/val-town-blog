import { defineConfig } from "astro/config";

import astroExpressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { h } from "hastscript";
import { visit } from "unist-util-visit";

import sitemap from "@astrojs/sitemap";
import { visit } from "unist-util-visit";

const mermaid = () => (tree) => {
  visit(tree, "code", (node) => {
    if (node.lang !== "mermaid") return;

    // @ts-ignore
    node.type = "html";
    node.value = `
      <script type='text/mermaid'>
        ${node.value}
      </script>
    `;
  });
};

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
  integrations: [astroExpressiveCode({
    // By default, expressive-code responds to light/dark
    // mode. This would make sense if our blog was also responsive
    // to light and dark mode, but since we're only supporting
    // light mode at the moment, we want to lock code into light
    // mode.
    theme: 'github-light'
  }), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, directiveToHtml, mermaid],
  },
  editLink: {
    baseUrl: "https://github.com/val-town/val-town-docs/edit/main/",
  },
  server: {
    port: 4322,
  },
});
