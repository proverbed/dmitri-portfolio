const WORDS_PER_MINUTE = 220;

/**
 * Estimates reading time from raw MDX source. Code fences are counted at a
 * quarter weight because they are scanned, not read, and JSX/import lines are
 * dropped entirely so component-heavy posts are not over-estimated.
 */
export function readingTime(source: string): number {
  const withoutImports = source.replace(/^import\s.+$/gm, "");
  const fences = withoutImports.match(/```[\s\S]*?```/g) ?? [];
  const prose = withoutImports.replace(/```[\s\S]*?```/g, " ");

  const count = (text: string): number => text.split(/\s+/).filter(Boolean).length;
  const words = count(prose) + count(fences.join(" ")) * 0.25;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
