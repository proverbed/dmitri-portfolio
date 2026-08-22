import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { SITE } from "../lib/site";
import { getPublishedArticles } from "../lib/writing";

export const GET: APIRoute = async (context) => {
  const articles = await getPublishedArticles();

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishDate,
      link: `/writing/${article.id}`,
      categories: [...article.data.tags],
    })),
    customData: `<language>${SITE.locale.toLowerCase()}</language>`,
  });
};
