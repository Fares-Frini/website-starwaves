import Link from "next/link";
import { EventCard } from "@/components/public/event-card";
import { Reveal } from "@/components/motion/reveal";
import { BlurHeading } from "@/components/react-bits/blur-heading";
import type { Dictionary } from "@/lib/i18n";
import type { EventSummary } from "@/lib/types";

/**
 * The events open now, on a light ground: this is where people read dates,
 * places and prices, so it trades the night for legibility. The cards are the
 * real public catalogue; with none published, the section says so — and if
 * the platform cannot be reached, it says that instead (`unavailable`), never
 * "nothing published".
 */
export function UpcomingEvents({
  dict,
  locale,
  events,
  unavailable = false,
}: {
  dict: Dictionary;
  locale: string;
  events: EventSummary[];
  unavailable?: boolean;
}) {
  return (
    <section className="section-y relative bg-surface-sunken">
      <div aria-hidden className="absolute inset-x-0 top-0 hairline-brand opacity-70" />
      <div className="container-site">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <BlurHeading text={dict.home.eventsTitle} className="font-display text-h2 font-medium text-ink" />
            <Reveal index={3}>
              <p className="mt-4 text-lead text-ink-muted">{dict.home.eventsLead}</p>
            </Reveal>
          </div>
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            {dict.home.eventsAll}
            <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none" className="rtl:rotate-180">
              <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </header>

        {events.length === 0 ? (
          <p className="mt-12 rounded-panel border border-dashed border-line-strong px-6 py-12 text-center text-ink-muted">
            {unavailable ? dict.site.unavailable.body : dict.home.eventsNone}
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal as="li" key={event.id} index={index}>
                <EventCard dict={dict} locale={locale} event={event} basePath="events" />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
