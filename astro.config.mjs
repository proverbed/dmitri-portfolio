// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

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
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
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
