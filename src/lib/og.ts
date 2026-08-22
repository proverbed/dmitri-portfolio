import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { SITE } from "./site";

const require = createRequire(import.meta.url);

const WIDTH = 1200;
const HEIGHT = 630;

// Read straight out of the font packages at build time. These faces are never
// served to a browser, so there is no reason to vendor them into public/.
// satori cannot decode woff2, which is why these are the static packages' woff.
const loadFont = async (family: "archivo" | "source-serif-4", weight: 400 | 600): Promise<ArrayBuffer> => {
  const path = require.resolve(
    `@fontsource/${family}/files/${family}-latin-${weight}-normal.woff`,
  );
  const buffer = await readFile(path);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
};

let fontsPromise: ReturnType<typeof loadAll> | null = null;

const fonts = (): ReturnType<typeof loadAll> => {
  fontsPromise ??= loadAll();
  return fontsPromise;
};

async function loadAll() {
  const [display, displayBold, body] = await Promise.all([
    loadFont("archivo", 400),
    loadFont("archivo", 600),
    loadFont("source-serif-4", 400),
  ]);

  return [
    { name: "Archivo", data: display, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: displayBold, weight: 600 as const, style: "normal" as const },
    { name: "Source Serif 4", data: body, weight: 400 as const, style: "normal" as const },
  ];
}

// Satori's element shape, written as plain objects. A JSX pragma would need a
// React dependency and a second JSX runtime in the build for four images.
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): Record<string, unknown> => ({ type, props: { style, children } });

// The palette, fixed: an OG card renders once and is viewed inside someone
// else's UI, so it does not follow a theme.
const INK = "#1b2028";
const PAPER = "#f7f8f9";
const SIGNAL = "#e8a33d";
const MUTED = "#8a94a1";
const RULE = "#454e5b";

export interface OgOptions {
  title: string;
  /** Small line above the title: "Writing" or "Case study". */
  kind: string;
}

export async function renderOgImage({ title, kind }: OgOptions): Promise<Uint8Array> {
  const svg = await satori(
    el(
      "div",
      {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
        color: PAPER,
        padding: "68px 76px",
        fontFamily: "Archivo",
      },
      [
        // The kicker, set as the utility label the site uses everywhere else.
        el(
          "div",
          {
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            color: MUTED,
            textTransform: "uppercase",
          },
          kind,
        ),
        el(
          "div",
          { display: "flex", flexDirection: "column" },
          [
            el(
              "div",
              {
                display: "flex",
                fontSize: title.length > 55 ? 60 : 74,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: -1.6,
                maxWidth: 960,
              },
              title,
            ),
            // The one signal rule, matching the one under every page title.
            el("div", { display: "flex", width: 220, height: 4, backgroundColor: SIGNAL, marginTop: 34 }, ""),
          ],
        ),
        el(
          "div",
          {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: MUTED,
            borderTop: `1px solid ${RULE}`,
            paddingTop: 26,
          },
          [
            el("div", { display: "flex", color: PAPER }, SITE.name),
            el("div", { display: "flex" }, SITE.url.replace("https://", "")),
          ],
        ),
      ],
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts: await fonts() },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
