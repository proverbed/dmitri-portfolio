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
npm run check        # astro check (TypeScript, strict)
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

`src/content/writing/typography-proof.mdx` is a scratch page that exercises every
element the article template renders. Keep it while iterating on the design;
delete it before launch.

## Design tokens

`src/styles/tokens.css` is the single source of truth for type, spacing and
colour. Dark mode redefines the same token names under
`prefers-color-scheme: dark` and nothing else in the codebase is aware it exists.
Prose styling lives in `src/components/Prose.astro` rather than being spread
through the markup.

Fonts are self-hosted and vendored into `public/fonts` by `scripts/sync-fonts.mjs`
from the `@fontsource*` packages — no third-party font CDN at runtime.

## Before first deploy

- [ ] Replace the `TODO:` values in `src/lib/site.ts` (name, URL, role, email, socials)
- [ ] Replace the `TODO:` copy on `/` and `/about`
- [ ] Update the sitemap URL in `public/robots.txt`
- [ ] Replace `public/favicon.svg`
- [ ] Delete `src/content/writing/typography-proof.mdx`

## Deploying

Static output in `dist/`. `netlify.toml` is included; for Cloudflare Pages use
build command `npm run build` and output directory `dist`. `public/_headers`
works on both.
