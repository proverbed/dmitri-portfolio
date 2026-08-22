import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"writing">;

/**
 * Drafts are built in dev so they can be previewed, and built in production so
 * their URL works when shared, but they are excluded from every listing, the
 * RSS feed and the sitemap, and carry `noindex`.
 */
export const includeDrafts = import.meta.env.DEV;

/**
 * A published article dated in the future is a placeholder someone forgot to
 * change — the stubs ship with invented dates so they sort sensibly while being
 * written. Rather than relying on remembering, publishing one fails the build.
 *
 * Drafts are exempt: a forward date on an unwritten piece is the normal state.
 */
export function assertNotPostdated(entries: readonly Article[]): void {
  const now = new Date();
  const postdated = entries.filter(
    (entry) => !entry.data.draft && entry.data.publishDate > now,
  );

  if (postdated.length > 0) {
    const list = postdated
      .map((entry) => `  ${entry.id} — ${entry.data.publishDate.toISOString().slice(0, 10)}`)
      .join("\n");
    throw new Error(
      `Published article(s) dated in the future:\n${list}\n` +
        "Set a real publishDate, or keep the article as draft: true.",
    );
  }
}

export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection("writing", ({ data }) => includeDrafts || !data.draft);
  assertNotPostdated(entries);
  return entries.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

/** Published only — used for RSS, where a draft leaking is permanent. */
export async function getPublishedArticles(): Promise<Article[]> {
  const entries = await getCollection("writing", ({ data }) => !data.draft);
  assertNotPostdated(entries);
  return entries.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

export function collectTags(articles: readonly Article[]): string[] {
  const tags = new Set<string>();
  for (const article of articles) {
    for (const tag of article.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}
