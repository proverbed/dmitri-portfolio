export interface Role {
  readonly company: string;
  readonly title: string;
  /** ISO year-month, e.g. "2025-08". */
  readonly start: string;
  /** ISO year-month, or null while the role is current. */
  readonly end: string | null;
  readonly location: string;
  readonly summary: string;
  readonly highlights: readonly string[];
}

export interface Qualification {
  readonly award: string;
  readonly institution: string;
  /** Equal to `startYear` for a single-year qualification. */
  readonly startYear: string;
  readonly endYear: string;
  readonly note?: string;
}

export const ROLES: readonly Role[] = [
  {
    company: "Zebra Renewables",
    title: "Senior Engineer",
    start: "2025-08",
    end: null,
    location: "Cape Town",
    summary:
      "Core engineer on a commercial multi-tenant commerce and ERP platform, and line manager for two junior engineers.",
    highlights: [
      "Designed and built multi-tenant authentication on Cognito: passkeys, trusted-device recognition, one-time codes, fail-closed entitlements",
      "Built the per-website static-site build pipeline, with one render engine shared by the production build and the admin preview so the two cannot drift",
      "Redesigned the CI/CD promotion flow with affected-service detection, cutting full test-suite runs from four per change to one",
      "Kept the previous generation of the platform running in live production for eleven months while its replacement was built",
      "Line-manage two engineers: priorities, 1:1s, weekly check-ins and performance reviews",
    ],
  },
  {
    company: "Tradedeal (Pty) Ltd",
    title: "Founder & Director",
    start: "2020-09",
    end: "2025-08",
    location: "Cape Town",
    summary:
      "Founded and ran an e-commerce business across two sales channels, building and operating the software that ran it. Started alongside a full-time engineering role, then run full-time from September 2021.",
    highlights: [
      "Peak annual turnover of R1.5m",
      "Built an internal inventory and order system in React, TypeScript and Firebase — stock tracking across both channels, automatic replenishment flagging, automated invoice generation",
      "Sole engineer and owner: product selection, pricing, architecture, fulfilment, and the commercial side",
    ],
  },
  {
    company: "Blackswan",
    title: "Full Stack Engineer",
    start: "2017-10",
    end: "2021-08",
    location: "Cape Town",
    summary:
      "Inflight retail platform serving three airlines, with the backend deployed to hardware on each aircraft.",
    highlights: [
      "Built frontend features in React and backend services in Node.js and TypeScript, plus the GraphQL schema and resolvers serving both the passenger client and the crew application",
      "Introduced Ansible to automate deployment across the fleet, replacing hand-run releases per airline",
      "Worked within hard constraints: offline for the duration of a flight, synchronisation only in scheduled ground windows, no rollback mid-air",
    ],
  },
  {
    company: "Ambition 24 Hours",
    title: "Web Developer & Engineering Team Lead",
    start: "2012-03",
    end: "2017-09",
    location: "Cape Town",
    summary:
      "Enterprise system for a UK nursing agency, covering the full cycle from booking candidates onto shifts through to paying them.",
    highlights: [
      "Backend development in PHP and Node.js across the agency's product suite",
      "Technical lead for two developers: specified and broke down tickets, and was their first point of reference",
      "Database administration, web server maintenance, and business reporting for non-technical users",
    ],
  },
  {
    company: "Inyameko",
    title: "Web Developer",
    start: "2011-08",
    end: "2012-02",
    location: "Cape Town",
    summary:
      "Development and maintenance on a national student financial aid award management system.",
    highlights: [],
  },
];

export const EDUCATION: readonly Qualification[] = [
  {
    award: "BSc (Honours) in Computer Science",
    institution: "University of the Western Cape",
    startYear: "2009",
    endYear: "2009",
    note: "Dean's Merit List",
  },
  {
    award: "BSc in Computer Science",
    institution: "University of the Western Cape",
    startYear: "2006",
    endYear: "2008",
  },
];

export const UNIVERSITY = "University of the Western Cape";
