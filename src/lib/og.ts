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
const loadFont = async (
  family: "archivo" | "source-serif-4" | "jetbrains-mono",
  weight: 400 | 600,
): Promise<ArrayBuffer> => {
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
  const [display, displayBold, body, mono] = await Promise.all([
    loadFont("archivo", 400),
    loadFont("archivo", 600),
    loadFont("source-serif-4", 400),
    loadFont("jetbrains-mono", 400),
  ]);

  return [
    { name: "Archivo", data: display, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: displayBold, weight: 600 as const, style: "normal" as const },
    { name: "Source Serif 4", data: body, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
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
// else's UI, so it does not follow a theme. Paper, not ink — the card should
// read as the same object as the page it represents.
const INK = "#1b2028";
const PAPER = "#f7f8f9";
const SIGNAL = "#e8a33d";

export interface OgOptions {
  title: string;
}

export async function renderOgImage({ title }: OgOptions): Promise<Uint8Array> {
  const svg = await satori(
    el(
      "div",
      {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PAPER,
        color: INK,
        padding: "68px 76px",
        fontFamily: "Archivo",
      },
      [
        el(
          "div",
          {
            display: "flex",
            fontSize: title.length > 55 ? 60 : 74,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -1.6,
            maxWidth: 1000,
          },
          title,
        ),
        el(
          "div",
          { display: "flex", flexDirection: "column" },
          [
            // The hairline rule, matching the one under every page title.
            el("div", { display: "flex", width: "100%", height: 1, backgroundColor: SIGNAL }, ""),
            el(
              "div",
              {
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 22,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginTop: 28,
              },
              SITE.name,
            ),
          ],
        ),
      ],
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts: await fonts() },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
