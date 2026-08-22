// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { codeBlockTransformer } from "./src/lib/shiki-code-block.mjs";

import { SITE } from "./src/lib/site";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "never",
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/404") })],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    // Shiki runs at build time. Both themes are emitted as CSS variables so
    // dark mode is a media query, not a second highlight pass in the browser.
    shikiConfig: {
      // High-contrast variants: the standard github-light red and orange fall
      // below 4.5:1 against our code background. Checked by scripts/check-contrast.mjs.
      themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
      defaultColor: false,
      wrap: false,
      transformers: [codeBlockTransformer],
    },
    rehypePlugins: [
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: { class: "heading-anchor", "aria-hidden": "true", tabindex: -1 },
          // Empty element on purpose: Astro collects `headings` after rehype
          // runs, so any text node here would leak into the table of contents.
          content: { type: "element", tagName: "span", properties: {}, children: [] },
        },
      ],
    ],
  },
});
