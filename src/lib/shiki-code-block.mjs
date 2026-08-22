/**
 * Wraps each highlighted block in a positioned container carrying the language,
 * so the label and the copy button have somewhere to anchor.
 *
 * This runs as a Shiki transformer rather than a rehype plugin: Astro highlights
 * during its markdown pipeline and hands rehype the result as raw HTML, so a
 * rehype tree walk never sees the `<pre>` element at all.
 */
export const codeBlockTransformer = {
  name: "code-block-wrapper",
  root(node) {
    const pre = node.children.find(
      (child) => child.type === "element" && child.tagName === "pre",
    );
    if (!pre) return;

    const language = this.options.lang;

    node.children = [
      {
        type: "element",
        tagName: "div",
        properties: {
          class: "code-block",
          ...(language && language !== "plaintext" ? { "data-language": language } : {}),
        },
        children: [pre],
      },
    ];
  },
};
