import type { ReactNode } from "react";

/**
 * The navigation icon set.
 *
 * Inline SVG rather than an icon package: eighteen glyphs do not justify a
 * dependency, and inlining keeps them on `currentColor` so they inherit the
 * active/inactive states of the nav without a second colour system.
 *
 * All are 20×20 on a 1.6 stroke, which is what keeps them looking like one
 * family rather than a collection.
 */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

export const Icons = {
  dashboard: () => (
    <Svg>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" />
    </Svg>
  ),
  events: () => (
    <Svg>
      <rect x="2.5" y="4" width="15" height="13.5" rx="2" />
      <path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" />
    </Svg>
  ),
  participants: () => (
    <Svg>
      <circle cx="7.5" cy="7" r="2.8" />
      <path d="M2.5 16.5c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5" />
      <path d="M13.5 5.6a2.6 2.6 0 0 1 0 5M14.5 12.4c1.8.5 3 1.9 3 4.1" />
    </Svg>
  ),
  registrations: () => (
    <Svg>
      <path d="M5.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v12.5a1 1 0 0 1-1.5.9L10 15.6l-4.5 1.8A1 1 0 0 1 4 16.5V4a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M7.5 7.5h5M7.5 10.5h3" />
    </Svg>
  ),
  sessions: () => (
    <Svg>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.5V10l3 1.8" />
    </Svg>
  ),
  accommodation: () => (
    <Svg>
      <path d="M2.5 16.5V6M2.5 12h15v4.5M17.5 12V9.5a2 2 0 0 0-2-2H9V12" />
      <circle cx="5.8" cy="9.2" r="1.5" />
    </Svg>
  ),
  communications: () => (
    <Svg>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="m3.5 6 6.5 4.5L16.5 6" />
    </Svg>
  ),
  documents: () => (
    <Svg>
      <path d="M11 2.5H6.5A1.5 1.5 0 0 0 5 4v12a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 16V6.5L11 2.5Z" />
      <path d="M11 2.5V6a.5.5 0 0 0 .5.5H15M7.5 11h5M7.5 13.5h3" />
    </Svg>
  ),
  albums: () => (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <circle cx="7" cy="8" r="1.4" />
      <path d="m3.5 14 4-3.5 3 2.5 3-2.5 3 3" />
    </Svg>
  ),
  payments: () => (
    <Svg>
      <rect x="2" y="4.5" width="16" height="11" rx="2" />
      <path d="M2 8.5h16" />
      <path d="M5.5 12.5h3" />
    </Svg>
  ),
  invoices: () => (
    <Svg>
      <path d="M4.5 2.5h11v15l-2.2-1.4-2.15 1.4L9 16.1l-2.2 1.4-2.3-1.4v-13Z" />
      <path d="M7.5 7h5M7.5 10h5" />
    </Svg>
  ),
  budgets: () => (
    <Svg>
      <path d="M3 16.5V9M7.7 16.5V4.5M12.3 16.5v-5M17 16.5v-9" />
    </Svg>
  ),
  checkIn: () => (
    <Svg>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m6.5 10.2 2.4 2.3 4.6-4.8" />
    </Svg>
  ),
  organizations: () => (
    <Svg>
      <path d="M3 17.5V4.5A1.5 1.5 0 0 1 4.5 3h6A1.5 1.5 0 0 1 12 4.5v13" />
      <path d="M12 8.5h3.5A1.5 1.5 0 0 1 17 10v7.5M2 17.5h16" />
      <path d="M5.8 6.5h3.4M5.8 9.5h3.4M5.8 12.5h3.4" />
    </Svg>
  ),
  users: () => (
    <Svg>
      <circle cx="10" cy="6.8" r="3" />
      <path d="M4 17c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2" />
    </Svg>
  ),
  access: () => (
    <Svg>
      <rect x="4" y="8.5" width="12" height="9" rx="2" />
      <path d="M7 8.5V6a3 3 0 1 1 6 0v2.5" />
    </Svg>
  ),
  audit: () => (
    <Svg>
      <path d="M4 3.5h8.5L16 7v9.5A1.5 1.5 0 0 1 14.5 18h-9A1.5 1.5 0 0 1 4 16.5v-13Z" />
      <path d="M7 11.5h6M7 14h4M12 3.5V7h4" />
    </Svg>
  ),
  catalog: () => (
    <Svg>
      <path d="M10.6 2.9H16a1.1 1.1 0 0 1 1.1 1.1v5.4a1.5 1.5 0 0 1-.44 1.06l-6 6a1.5 1.5 0 0 1-2.12 0l-4.56-4.56a1.5 1.5 0 0 1 0-2.12l6-6a1.5 1.5 0 0 1 1.06-.44Z" />
      <circle cx="13.4" cy="6.6" r="1.1" />
    </Svg>
  ),
  commitments: () => (
    <Svg>
      <rect x="2.5" y="5.5" width="15" height="9.5" rx="2" />
      <circle cx="10" cy="10.25" r="2.1" />
      <path d="M5.4 8.4v3.7M14.6 8.4v3.7" />
    </Svg>
  ),
  profile: () => (
    <Svg>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4.2 17c0-2.9 2.6-5 5.8-5s5.8 2.1 5.8 5" />
    </Svg>
  ),
  chevron: () => (
    <Svg>
      <path d="m7.5 4.5 5 5.5-5 5.5" />
    </Svg>
  ),
  // A bell, not the speech bubble the header borrowed from `communications`.
  // That glyph means "messages we send about an event"; this one means "things
  // waiting for you", and the two sat next to each other meaning different
  // things.
  bell: () => (
    <Svg>
      <path d="M5.5 8a4.5 4.5 0 0 1 9 0c0 3.2.8 4.6 1.5 5.4H4c.7-.8 1.5-2.2 1.5-5.4Z" />
      <path d="M8.2 16a1.9 1.9 0 0 0 3.6 0" />
    </Svg>
  ),
  signOut: () => (
    <Svg>
      <path d="M12.5 5.8V4.2a1.7 1.7 0 0 0-1.7-1.7H4.7A1.7 1.7 0 0 0 3 4.2v11.6a1.7 1.7 0 0 0 1.7 1.7h6.1a1.7 1.7 0 0 0 1.7-1.7v-1.6" />
      <path d="M8 10h9" />
      <path d="m14.2 7.2 2.8 2.8-2.8 2.8" />
    </Svg>
  ),
} satisfies Record<string, () => ReactNode>;

export type IconName = keyof typeof Icons;

export function Icon({ name }: { name: IconName }) {
  const Glyph = Icons[name];
  return <Glyph />;
}
