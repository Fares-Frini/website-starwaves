/** The shapes of the platform's public event payloads that this site reads. */

export interface OrganizationRef {
  id: string;
  name: string;
  slug?: string;
}

export interface PersonRef {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/** What the caller is, and may do, on one event — `GET /events/:id/me`. */
export type EventRole =
  | "EVENT_LEAD"
  | "ORGANIZER"
  | "FINANCE"
  | "CHECKIN_STAFF";

export interface EventStanding {
  eventId: string;
  /** `PLATFORM` for Starwaves staff. `null`: can see it, holds no role on it. */
  role: EventRole | "PLATFORM" | null;
  via: ("platform" | "grant" | "organization")[];
  /** Permissions held **on this event** — not the union across every event. */
  permissions: string[];
}

/** Whether an event is taking registrations right now, and why not if it is not. */
export interface RegistrationStateView {
  state: "NOT_OPEN" | "OPEN" | "CLOSED" | "FULL";
  reason?: "STATUS" | "NOT_YET" | "DEADLINE" | "OVERRIDE" | "CAPACITY" | "FORM";
}

export type EventVisibility = "PUBLIC" | "UNLISTED" | "PRIVATE";
export type RegistrationWindowOverride = "AUTO" | "FORCE_OPEN" | "FORCE_CLOSED";

export interface EventSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  type?: string;
  startDate: string;
  endDate?: string | null;
  currency: string;
  timeZone?: string | null;
  capacity?: number | null;
  referenceCode?: string | null;
  /** Branding, per PRD §3.1. Present on the public projection; usually null
   *  until a committee uploads artwork, so every consumer needs a fallback. */
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  publicSummary?: string | null;
  description?: string | null;
  registrationOpensAt?: string | null;
  registrationDeadline?: string | null;
  /** Both are on the event payload and both are editable in settings; they
   *  were simply missing from this type, so the editor could not read them
   *  back and every edit silently blanked them. */
  websiteUrl?: string | null;
  edition?: string | null;
  /** Computed by the API from status, dates, capacity and the organiser's override. */
  registrationState?: RegistrationStateView;
  /** Only on the organiser's own read, never on the public projection. */
  settings?: {
    visibility: EventVisibility;
    registrationOverride: RegistrationWindowOverride;
    organizerDirectEdit: boolean;
  } | null;
  organization?: OrganizationRef | null;
  /** Where it happens, when the event shows it to the public. */
  venue?: {
    name?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  /** The lowest active category price on the public list (`null`: none set). */
  priceFrom?: string | null;
  _count?: { registrations?: number; participants?: number };
}

