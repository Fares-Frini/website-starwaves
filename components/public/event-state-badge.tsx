import { Badge, type Tone } from "@/components/ui";
import type { RegistrationStateView } from "@/lib/types";
import { label, statusTone } from "@/lib/display";
import type { Dictionary } from "@/lib/i18n";

/** Statuses in which an event can take registrations (the API's own list). */
const TAKING = new Set(["PUBLISHED", "REGISTRATION_OPEN"]);

const STATE_TONES: Record<RegistrationStateView["state"], Tone> = {
  OPEN: "success",
  NOT_OPEN: "info",
  CLOSED: "neutral",
  FULL: "warning",
};

/**
 * The one badge for an event, as on the platform: once it is published, what
 * a visitor needs is whether they can register — the API's answer, which
 * counts the organiser opening registration, dates and seats — not the bare
 * status. Before publication or after the event, the status is the answer.
 */
export function EventStateBadge({
  dict,
  status,
  registrationState,
}: {
  dict: Dictionary;
  status: string;
  registrationState?: RegistrationStateView | null;
}) {
  if (TAKING.has(status)) {
    if (registrationState) {
      return (
        <Badge tone={STATE_TONES[registrationState.state]}>
          {dict.regState[registrationState.state]}
        </Badge>
      );
    }
    return <Badge tone={statusTone("PUBLISHED")}>{label(dict, "PUBLISHED")}</Badge>;
  }
  return <Badge tone={statusTone(status)}>{label(dict, status)}</Badge>;
}
