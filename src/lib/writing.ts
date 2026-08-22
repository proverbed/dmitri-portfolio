import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"writing">;

/**
 * Drafts are built in dev so they can be previewed, and built in production so
 * their URL works when shared, but they are excluded from every listing, the
 * RSS feed and the sitemap, and carry `noindex`.
 */
export const includeDrafts = import.meta.env.DEV;

export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection("writing", ({ data }) => includeDrafts || !data.draft);
  return entries.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

/** Published only — used for RSS, where a draft leaking is permanent. */
export async function getPublishedArticles(): Promise<Article[]> {
  const entries = await getCollection("writing", ({ data }) => !data.draft);
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
