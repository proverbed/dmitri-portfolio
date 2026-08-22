import { getCollection, type CollectionEntry } from "astro:content";

export type CaseStudy = CollectionEntry<"work">;

/**
 * Every case study answers the same five questions in the same order. This is
 * checked at build time rather than left to discipline: four pages that drift
 * apart are worse than four that are rigid, because the reader is comparing
 * them.
 */
export const REQUIRED_SECTIONS = [
  "Context",
  "Constraints",
  "What I built",
  "Decisions and trade-offs",
  "Outcome",
] as const;

export function assertSections(entry: CaseStudy): void {
  const headings = [...(entry.body ?? "").matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);

  if (headings.length !== REQUIRED_SECTIONS.length ||
      headings.some((heading, i) => heading !== REQUIRED_SECTIONS[i])) {
    throw new Error(
      `Case study "${entry.id}" must have exactly these level-2 headings, in order:\n` +
        `  ${REQUIRED_SECTIONS.join(" / ")}\n` +
        `Found:\n  ${headings.length > 0 ? headings.join(" / ") : "(none)"}`,
    );
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const entries = await getCollection("work", ({ data }) => !data.draft);
  for (const entry of entries) assertSections(entry);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
