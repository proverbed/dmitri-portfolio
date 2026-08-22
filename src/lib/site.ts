export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export const SITE = {
  // TODO: replace with the production domain before first deploy.
  url: "https://example.com",
  name: "TODO: Your Name",
  role: "TODO: one-line positioning",
  description: "TODO: site-level meta description (155 characters or fewer).",
  locale: "en-GB",
  email: "TODO: you@example.com",
} as const;

export const SOCIALS: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/TODO" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/TODO" },
];

export const NAV: readonly SocialLink[] = [
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];
