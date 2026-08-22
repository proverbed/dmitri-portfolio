import type { APIRoute, GetStaticPaths } from "astro";

import { renderOgImage } from "../../lib/og";
import { getArticles } from "../../lib/writing";

export const getStaticPaths = (async () => {
  const articles = await getArticles();
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { title: article.data.title },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ title: string }> = async ({ props }) => {
  const png = await renderOgImage({ title: props.title, kind: "Writing" });

  return new Response(png as BodyInit, {
    headers: { "Content-Type": "image/png" },
  });
};
