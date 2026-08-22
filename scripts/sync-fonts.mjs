// Copies the latin subsets we actually use from the fontsource packages into
// public/fonts. Fonts are vendored into the repo so the build has no network
// dependency and the site serves them from its own origin.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", "fonts");

const FILES = [
  [
    "@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
    "source-serif-4-latin-wght-normal.woff2",
  ],
  [
    "@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2",
    "source-serif-4-latin-wght-italic.woff2",
  ],
  [
    "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
    "jetbrains-mono-latin-400-normal.woff2",
  ],
];

await mkdir(dest, { recursive: true });
for (const [from, to] of FILES) {
  await copyFile(join(root, "node_modules", from), join(dest, to));
  console.log(`fonts: ${to}`);
}
