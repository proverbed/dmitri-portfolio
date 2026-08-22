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
