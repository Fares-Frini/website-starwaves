import type { Tone } from "@/components/ui";
import type { Dictionary } from "@/lib/i18n";

/**
 * How server enums and instants are presented.
 *
 * Centralised so a status means the same thing wherever it appears: an event,
 * a registration and a payment that are all "cancelled" get the same colour,
 * and a reader learns the vocabulary once.
 *
 * Status itself is always the server's — derived from its own rules. Nothing
 * here decides a status, it only renders one.
 */

const STATUS_TONES: Record<string, Tone> = {
  // Events
  DRAFT: "neutral",
  PLANNED: "neutral",
  PUBLISHED: "info",
  REGISTRATION_OPEN: "success",
  REGISTRATION_CLOSED: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "neutral",
  CANCELLED: "danger",
  ARCHIVED: "neutral",

  // Registrations
  UNDER_REVIEW: "warning",
  PENDING_PAYMENT: "warning",
  PENDING_VERIFICATION: "warning",
  CONFIRMED: "success",
  CHECKED_IN: "success",
  NO_SHOW: "danger",
  REJECTED: "danger",
  WAITING_LIST: "info",

  // Logistics
  SUBMITTED: "info",
  QUOTED: "warning",
  CHANGES_REQUESTED: "warning",
  ACCEPTED: "success",
  DECLINED: "danger",
  DELIVERED: "success",
  CLOSED: "neutral",
  SENT: "warning",
  EXPIRED: "neutral",

  // Payments
  NOT_REQUIRED: "neutral",
  OVERPAID: "info",
  REFUND_DUE: "warning",
  UNPAID: "warning",
  VERIFIED: "success",
  PAID: "success",
  PARTIALLY_PAID: "warning",
  FAILED: "danger",
  REFUND_REQUESTED: "warning",
  REFUNDED: "neutral",

  // Users and organizations
  ACTIVE: "success",
  INACTIVE: "neutral",
  SUSPENDED: "danger",
};

export function statusTone(status: string | null | undefined): Tone {
  if (!status) return "neutral";
  return STATUS_TONES[status] ?? "neutral";
}

/** `REGISTRATION_OPEN` → `Registration open`, as a last resort. */
export function humanise(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * A translated label for a server enum.
 *
 * Statuses are user-facing text, so they are translated rather than shown raw
 * — "Registration open" inside an otherwise French screen is exactly the kind
 * of seam that makes a product feel unfinished.
 *
 * Unknown values fall back to `humanise` instead of rendering blank, so a new
 * enum added server-side degrades to something readable rather than
 * disappearing from the interface.
 */
export function label(
  dict: Dictionary,
  value: string | null | undefined,
): string {
  if (!value) return "—";
  const enums = dict.enums as Record<string, string | undefined>;
  return enums[value] ?? humanise(value);
}

/**
 * Dates are rendered in the *event's* time zone where one is given.
 *
 * A congress in Tunis starting at 09:00 must read as 09:00 to an organiser
 * looking at it from anywhere — showing the reader's local time turns the
 * schedule into a puzzle.
 */
export function formatDate(
  iso: string | null | undefined,
  locale: string,
  timeZone?: string | null,
): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(d);
}

export function formatDateTime(
  iso: string | null | undefined,
  locale: string,
  timeZone?: string | null,
): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(d);
}

/** "1 – 3 May 2029" style, collapsing shared month and year. */
export function formatDateRange(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  locale: string,
  timeZone?: string | null,
): string {
  if (!startIso) return "—";
  if (!endIso) return formatDate(startIso, locale, timeZone);

  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";

  const tz = timeZone ? { timeZone } : {};
  const sameDay =
    new Intl.DateTimeFormat("en-CA", { ...tz, dateStyle: "short" }).format(start) ===
    new Intl.DateTimeFormat("en-CA", { ...tz, dateStyle: "short" }).format(end);

  if (sameDay) return formatDate(startIso, locale, timeZone);

  const sameMonth =
    new Intl.DateTimeFormat("en-CA", { ...tz, month: "2-digit", year: "numeric" }).format(
      start,
    ) ===
    new Intl.DateTimeFormat("en-CA", { ...tz, month: "2-digit", year: "numeric" }).format(
      end,
    );

  if (sameMonth) {
    // 2-digit to match `formatDate`, which supplies the other half of the
    // range — "1 – 03 mai" reads as a typo where "01 – 03 mai" reads as a range.
    const day = new Intl.DateTimeFormat(locale, { ...tz, day: "2-digit" }).format(start);
    return `${day} – ${formatDate(endIso, locale, timeZone)}`;
  }

  return `${formatDate(startIso, locale, timeZone)} – ${formatDate(endIso, locale, timeZone)}`;
}

export function fullName(
  person: { firstName?: string | null; lastName?: string | null } | null | undefined,
): string {
  if (!person) return "—";
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ").trim();
  return name || "—";
}
