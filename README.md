# Personal site

Static site built with Astro 5. Articles are MDX in a typed content collection;
everything renders at build time and the article page ships no client JavaScript.

## Commands

```bash
npm install
npm run sync:fonts   # vendor the latin font subsets into public/fonts
npm run dev          # http://localhost:4321
npm run build        # -> dist/
npm run preview      # serve dist/
npm run check          # astro check (TypeScript, strict)
npm run check:contrast # syntax colours vs code background, both themes
```

## Writing

Articles live in `src/content/writing/*.mdx`. Frontmatter is validated by Zod in
`src/content.config.ts`:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | ≤ 120 characters |
| `description` | yes | ≤ 200 characters; used for the listing, meta and RSS |
| `publishDate` | yes | `YYYY-MM-DD` |
| `updatedDate` | no | shown in the byline and in the `Article` structured data |
| `tags` | no | each tag gets a static page at `/writing/tag/<tag>` |
| `draft` | no | defaults to `false` |

Drafts exist in `npm run dev` only — they get a URL, appear in listings and are
flagged as drafts on the page. A production build does not route them at all, so
there is no unpublished URL to leak into the sitemap or be guessed at. To share
one for review, run the dev server or deploy a preview branch.

Components available inside MDX: `Figure` (with `bleed` for wide diagrams) and
`Callout` (`note` / `warning` / `aside`). Import them from `../../components/`.
Footnotes use GFM syntax and are styled as an apparatus at the end of the piece.
Code fences get a language label and a copy button automatically.

## Case studies

`src/content/work/*.mdx`. Ordered by the `order` field, not by date.
`relatedWriting` holds writing slugs and is resolved at build time: a slug that
names no article fails the build; one that names a draft is simply not shown.

Every case study must carry exactly these level-2 headings, in this order:

    Context / Constraints / What I built / Decisions and trade-offs / Outcome

This is checked in `src/lib/work.ts` and **fails the build** if it drifts. Four
pages a reader compares side by side are worth the rigidity.

## CV / career history

`/about` renders its career history from `src/lib/cv.ts` — a typed array, one
place to edit. Each role carries `company`, `title`, `start`, `end` (null while
current), `location`, `summary` and `highlights`. Dates are ISO year-months
(`"2025-08"`) and are formatted for display and emitted as `<time datetime>`.

There is deliberately no PDF and no download link: the page is the CV.

The email address is percent-encoded in the `mailto:` href and written as numeric
character references in the visible text (`src/lib/email.ts`), so the plain
string never appears in the served HTML. Both decode in the browser with no
JavaScript. This defeats scrapers that regex the raw file and nothing more —
which is the ceiling for a static page.

## OG images

Generated at build time by `src/lib/og.ts` (satori → SVG, resvg → PNG) and served
from `/og/<slug>.png` and `/og/work/<slug>.png`. The fonts are read straight out
of `@fontsource/source-serif-4` at build time — satori cannot decode woff2, which
is why that package (static, ships `.woff`) sits alongside the variable one used
by the browser.

## Design system

`src/styles/tokens.css` is the single source of truth. Six named palette values
(`ink`, `paper`, `signal`, `deep`, `rule`, `muted`) are the source; every other
colour derives from them. Dark mode redefines the semantic tokens under
`prefers-color-scheme: dark`; `signal` is identical in both.

`signal` is the one accent, used as an indicator rather than a highlight: the
active nav item, one rule under each page title, the callout rule on a warning,
inline code, the focus ring. It is never a background fill.

Three measured corrections live in the tokens and are asserted by
`npm run check:contrast`, which fails the build script if any drifts:

| Pair | As briefed | Used |
| --- | --- | --- |
| signal on paper | 2.03:1 | links are `deep` text with a signal underline |
| muted on paper | 4.45:1 | `#646d79` → 4.93:1 |
| muted on ink | 3.45:1 | `#8a94a1` → 5.32:1 |

Type: **Archivo** 600 for display (tight, -0.02em, 1.05), **Source Serif 4** at
19px/1.65 for body, **JetBrains Mono** at 13px uppercase with 0.08em tracking for
labels, metadata and code. Every face is self-hosted and vendored into
`public/fonts` by `scripts/sync-fonts.mjs` — no third-party font CDN.

Each has a `size-adjust` fallback measured in-browser against the real face, so
the `font-display: swap` costs no layout shift.

Prose styling lives in `src/components/Prose.astro`; the spec block is
`src/components/SpecBlock.astro`.

## Layout

Article and case study pages use the annotated grid: a `--margin-column` gutter
carrying the spec block and contents list, with the text column offset right,
the way a technical manual annotates. Below 64rem the margin content collapses
above the text it annotates.

## Measured

Lighthouse on the article page, against `npm run preview`, with a representative
published article (prose, two code blocks, a table, callouts, footnotes):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 100 | 100 | 100 | 100 |

Every article is currently a draft, so re-run it against a real post before
trusting those numbers again: `npx lighthouse <url> --preset=desktop`.

## Before first deploy

- [ ] Replace `public/favicon.svg`
- [ ] Point DNS at the host and confirm `SITE.url` in `src/lib/site.ts`

## Deploying

Static output in `dist/`. `netlify.toml` is included; for Cloudflare Pages use
build command `npm run build` and output directory `dist`. `public/_headers`
works on both.
