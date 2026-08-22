import { SITE } from "./site";

const FULL = new Intl.DateTimeFormat(SITE.locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date): string {
  return FULL.format(date);
}

/** ISO 8601 date portion, for the `datetime` attribute on <time>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Fixed abbreviations rather than Intl: en-GB renders September as "Sept",
// which is correct but reads inconsistently beside three-letter neighbours.
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** "2025-08" -> "Aug 2025". */
export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split("-");
  const name = MONTHS[Number(month) - 1];

  if (!year || !name) {
    throw new Error(`Expected an ISO year-month such as "2025-08", got "${isoMonth}".`);
  }

  return `${name} ${year}`;
}
