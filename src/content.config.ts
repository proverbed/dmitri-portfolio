import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(200),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(1).max(120),
    summary: z.string().min(1).max(200),
    /** Human-readable span, e.g. "2025–present". */
    period: z.string().min(1),
    /** What the system was and who used it — one line for the spec block. */
    domain: z.string().min(1).max(80),
    /** Optional scale figure for the spec block — a headcount or volume. */
    scale: z.string().min(1).max(80).optional(),
    /** The constraint that defined the work — one line for the spec block. */
    constraint: z.string().min(1).max(80),
    /** The two or three that matter — not an inventory. */
    tech: z.array(z.string().min(1)).min(1).max(8),
    /** Ascending; the index is ordered by this, not by date. */
    order: z.number().int(),
    /** Slugs in the writing collection this case study relates to. */
    relatedWriting: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, work };
