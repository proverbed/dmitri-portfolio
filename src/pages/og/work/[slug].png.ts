import type { APIRoute, GetStaticPaths } from "astro";

import { renderOgImage } from "../../../lib/og";
import { getCaseStudies } from "../../../lib/work";

export const getStaticPaths = (async () => {
  const studies = await getCaseStudies();
  return studies.map((study) => ({
    params: { slug: study.id },
    props: { title: study.data.title },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ title: string }> = async ({ props }) => {
  const png = await renderOgImage({ title: props.title });

  return new Response(png as BodyInit, {
    headers: { "Content-Type": "image/png" },
  });
};
