export interface Link {
  readonly label: string;
  readonly href: string;
}

export const SITE = {
  url: "https://dmitrideklerk.com",
  name: "Dmitri De Klerk",
  /** The masthead carries the name, so the landing headline carries the claim. */
  thesis: "Fifteen years building systems that have to work",
  role: "Senior engineer, Cape Town",
  description: "Senior engineer, Cape Town. Writing about systems that have to work.",
  locale: "en-GB",
} as const;

export const SOCIALS: readonly Link[] = [
  { label: "GitHub", href: "https://github.com/proverbed" },
  { label: "LinkedIn", href: "https://linkedin.com/in/dmitri-de-klerk-b78a41160" },
];

export const NAV: readonly Link[] = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];
