/**
 * Checks every colour Shiki actually emitted in the built HTML against the code
 * background in both themes. Lighthouse only samples the tokens present on the
 * page it audits; this covers every token the build produced.
 *
 * Run after `npm run build`.
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const CODE_BG = { light: "#f4f3f0", dark: "#1c1e22" };
const MIN_RATIO = 4.5;

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const found = { light: new Set(), dark: new Set() };

for await (const file of htmlFiles("dist")) {
  const html = await readFile(file, "utf8");
  for (const [, theme, hex] of html.matchAll(/--shiki-(light|dark):(#[0-9a-fA-F]{6})/g)) {
    found[theme].add(hex.toLowerCase());
  }
}

const total = found.light.size + found.dark.size;

// A pass over nothing is not a pass. The built site legitimately contains no
// highlighted code while every article is a draft, so say which case this is
// rather than printing a green tick either way.
if (total === 0) {
  console.warn(
    "No highlighted code found in dist/ — nothing was checked. " +
      "This is expected while no published article contains a code block.",
  );
  process.exit(0);
}

let failures = 0;

for (const theme of ["light", "dark"]) {
  for (const hex of [...found[theme]].sort()) {
    const ratio = contrast(hex, CODE_BG[theme]);
    if (ratio < MIN_RATIO) {
      console.error(`FAIL ${theme}: ${hex} on ${CODE_BG[theme]} = ${ratio.toFixed(2)}:1`);
      failures += 1;
    }
  }
  console.log(`${theme}: ${found[theme].size} token colours checked`);
}

if (failures > 0) {
  console.error(`\n${failures} syntax colour(s) below ${MIN_RATIO}:1.`);
  process.exit(1);
}

console.log(`All syntax colours meet ${MIN_RATIO}:1.`);
