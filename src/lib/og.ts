import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { SITE } from "./site";

const require = createRequire(import.meta.url);

const WIDTH = 1200;
const HEIGHT = 630;

// Read straight out of the font package at build time. These faces are never
// served to a browser, so there is no reason to vendor them into public/.
// satori cannot decode woff2, which is why this is the static package's woff.
const loadFont = async (weight: 400 | 600): Promise<ArrayBuffer> => {
  const path = require.resolve(
    `@fontsource/source-serif-4/files/source-serif-4-latin-${weight}-normal.woff`,
  );
  const buffer = await readFile(path);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
};

let fontsPromise: Promise<
  { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[]
> | null = null;

const fonts = (): ReturnType<typeof loadAll> => {
  fontsPromise ??= loadAll();
  return fontsPromise;
};

async function loadAll() {
  const [regular, semibold] = await Promise.all([loadFont(400), loadFont(600)]);
  return [
    { name: "Source Serif 4", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Source Serif 4", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

// Satori's element shape, written as plain objects. A JSX pragma would need a
// React dependency and a second JSX runtime in the build for four images.
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): Record<string, unknown> => ({ type, props: { style, children } });

const BG = "#171a1f";
const INK = "#f3f1ec";
const MUTED = "#9aa3b0";
const ACCENT = "#8fb4f2";

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
        backgroundColor: BG,
        color: INK,
        padding: "72px 80px",
        fontFamily: "Source Serif 4",
      },
      [
        el("div", { display: "flex", fontSize: 26, letterSpacing: 2, color: ACCENT }, kind.toUpperCase()),
        el(
          "div",
          {
            display: "flex",
            fontSize: title.length > 55 ? 62 : 76,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: -1,
            maxWidth: 940,
          },
          title,
        ),
        el(
          "div",
          {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: MUTED,
            borderTop: `1px solid #2c313a`,
            paddingTop: 28,
          },
          [
            el("div", { display: "flex", color: INK }, SITE.name),
            el("div", { display: "flex" }, SITE.url.replace("https://", "")),
          ],
        ),
      ],
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts: await fonts() },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
