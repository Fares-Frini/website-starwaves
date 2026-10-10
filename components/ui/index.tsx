import Link from "next/link";
import type { ReactNode } from "react";
import { BackLink } from "./back-link";

/**
 * The interface primitives.
 *
 * Deliberately one small file rather than a folder of near-identical
 * components: they are simple, they change together, and keeping them in view
 * of each other is what stops a second slightly-different card appearing next
 * month. Anything that needs interactivity lives in its own client component.
 */

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* Page furniture                                                             */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** A custom breadcrumb. Prefer `back` unless the page needs a full trail. */
  breadcrumb?: ReactNode;
  /**
   * The way out of this page. Every screen should offer one — a person who
   * lands somewhere by accident needs a door, not the browser chrome.
   */
  back?: { href?: string; label: string };
}) {
  return (
    <header className="mb-6">
      {breadcrumb ? (
        <div className="mb-2">{breadcrumb}</div>
      ) : back ? (
        <div className="mb-2">
          <BackLink href={back.href} label={back.label} />
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          ) : null}
        </div>
        {/* Wraps below `sm`: four actions in a `shrink-0` row pushed the event
            overview wider than a 390px screen. */}
        {actions ? (
          <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cx(
        // `min-w-0` because a card is almost always a grid or flex item, and
        // those default to `min-width: auto` — they refuse to shrink below
        // their content's min-content width. A card of details was therefore
        // 31px wider than its own column at 390px and pushed the whole page
        // into a horizontal scroll. A card should wrap or truncate its
        // contents, never widen what contains it.
        "min-w-0 rounded-card border border-line bg-surface shadow-card",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  /** The organiser-access mark — "you manage this", not the ordinary primary
   *  action, so it gets its own colour rather than brand blue. */
  | "violet"
  /** Solid white on a dark/gradient surface. */
  | "onDark"
  /** Outlined, for the secondary action on a dark surface. */
  | "onDarkGhost";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 border border-transparent shadow-card",
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-surface-hover",
  ghost: "bg-transparent text-ink-muted border border-transparent hover:bg-surface-hover hover:text-ink",
  danger: "bg-danger text-white hover:brightness-110 border border-transparent",
  violet: "bg-violet text-white hover:brightness-110 border border-transparent shadow-card",
  // These exist as variants rather than as utility overrides on `primary`:
  // Tailwind resolves conflicting utilities by stylesheet order, not by the
  // order they appear in the class attribute, so `text-ink` after `text-white`
  // is not reliably the winner — it rendered white-on-white in the hero.
  onDark: "bg-white text-ink hover:bg-white/90 border border-transparent",
  onDarkGhost:
    "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  // 36px and 44px. The larger is the default on touch surfaces — the on-site
  // screens are used one-handed and a 32px target is not usable there.
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "sm") {
  return cx(
    // `whitespace-nowrap`: a button label that wraps to two lines inside a
    // fixed-height control overflows it. French labels are ~30% longer than the
    // English, so this shows up on the narrow end first — "Se connecter" broke
    // across two lines in the mobile header.
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
  );
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "sm",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(buttonClass(variant, size), className)}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

export type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  /** The organiser-access mark — see `buttonClass`'s `violet` variant. */
  | "violet";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-hover text-ink-muted border-line-strong",
  info: "bg-info-bg text-info border-info-line",
  success: "bg-success-bg text-success border-success-line",
  warning: "bg-warning-bg text-warning border-warning-line",
  danger: "bg-danger-bg text-danger border-danger-line",
  violet: "bg-violet-bg text-violet border-violet-line",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  const accent =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "danger"
          ? "text-danger"
          : "text-ink";

  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
      {/* Tabular figures so a column of these does not jitter between values. */}
      <p className={cx("tabular mt-1.5 text-2xl font-semibold tracking-tight", accent)}>
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tables                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A real `<table>`, not a grid of divs — these are tabular data and screen
 * readers need the row/column relationships to navigate them.
 *
 * The wrapper scrolls horizontally on its own so a wide table never makes the
 * whole page scroll sideways.
 */
export function Table({
  head,
  children,
  caption,
}: {
  head: ReactNode;
  children: ReactNode;
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-line bg-surface-sunken text-left">{head}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={cx(
        "whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-subtle",
        align === "right" && "text-right",
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className,
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cx(
        "px-4 py-3 align-middle text-ink",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="transition-colors hover:bg-surface-sunken">{children}</tr>;
}

/* -------------------------------------------------------------------------- */
/* Empty, error and loading                                                   */
/* -------------------------------------------------------------------------- */

/**
 * "Nothing here" must never look like "still loading" — one asks you to wait,
 * the other tells you to act. This is deliberately illustrative and static;
 * the skeleton below is deliberately animated.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
      <div
        aria-hidden
        className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-surface-hover text-ink-faint"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="4" width="14" height="12" rx="2" />
          <path d="M3 8h14" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-medium text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div
      className="overflow-hidden rounded-card border border-line bg-surface shadow-card"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Chargement…</span>
      <div className="h-10 border-b border-line bg-surface-sunken" />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-line px-4 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 animate-pulse rounded bg-line"
              style={{ width: c === 0 ? "22%" : `${14 + ((r + c) % 3) * 6}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-card border border-line bg-surface p-4 shadow-card">
          <div className="h-3 w-20 animate-pulse rounded bg-line" />
          <div className="mt-3 h-7 w-28 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Misc                                                                       */
/* -------------------------------------------------------------------------- */

/** Two lines in a table cell: a primary value and a quieter secondary one. */
export function Stacked({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="truncate font-medium text-ink">{primary}</div>
      {secondary ? (
        <div className="truncate text-xs text-ink-subtle">{secondary}</div>
      ) : null}
    </div>
  );
}

export function Avatar({
  name,
  src,
  size = 32,
}: {
  name: string;
  /** A profile picture, when there is one — falls back to initials. */
  src?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "?"}
    </span>
  );
}

/** A labelled value, for detail panels. */
export function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm text-ink">{children}</dd>
    </div>
  );
}
