import type { APIRoute, GetStaticPaths } from "astro";

import { renderOgImage } from "../../../lib/og";
import { SITE } from "../../../lib/site";

// Static, non-collection pages each get one fixed OG card. Anything backed by
// a content collection (writing, work) has its own dynamic [slug].png route.
const PAGES: Record<string, string> = {
  index: SITE.thesis,
  about: "About",
  work: "Work",
  writing: "Writing",
};

export const getStaticPaths = (() => {
  return Object.entries(PAGES).map(([slug, title]) => ({
    params: { slug },
    props: { title },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ title: string }> = async ({ props }) => {
  const png = await renderOgImage({ title: props.title });

  return new Response(png as BodyInit, {
    headers: { "Content-Type": "image/png" },
  });
};
