/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import type { EventSummary } from "@/lib/types";
import { platform } from "@/lib/platform";
import type { Dictionary } from "@/lib/i18n";
import { formatDateRange, label } from "@/lib/display";
import { formatMoney, isZero } from "@/lib/money";
import { eventNights } from "@/lib/event-nights";
import { cn } from "@/lib/utils";
import { EventStateBadge } from "@/components/public/event-state-badge";

/**
 * One event, as a card, for the catalogue and the home page.
 *
 * Reads in the order a visitor decides: when (the date stamp on the picture),
 * what (type, name, who runs it), where and how long, how much — then the two
 * ways in. Every figure is the public API's: the price is its lowest active
 * category (`priceFrom`), the nights are counted from the event's own dates.
 *
 * **The picture has to work when there is no picture.** A committee uploads
 * artwork late, if at all, so the fallback is a designed state: a small piece
 * of the site's night sky — stars, a nebula in one of four brand tints chosen
 * from the event's id, and the Starwaves star glowing in it.
 *
 * **Two links, not a stretched one**: reading about the event and registering
 * are different destinations, each its own control. "Register" points at the
 * platform, which decides whether to open the form or ask for sign-in; the
 * card knows nothing about the visitor.
 *
 * A plain `<img>`, not `next/image`: cover URLs are arbitrary per-tenant hosts
 * that would each need allow-listing in `remotePatterns`.
 */

/** Four nebula tints, picked per event so a page of cover-less events varies. */
const SKIES = [
  "radial-gradient(circle at 25% 30%, rgb(46 134 239 / 0.55), transparent 55%), radial-gradient(circle at 80% 80%, rgb(129 122 224 / 0.45), transparent 60%)",
  "radial-gradient(circle at 75% 25%, rgb(215 107 242 / 0.45), transparent 55%), radial-gradient(circle at 20% 85%, rgb(46 134 239 / 0.45), transparent 60%)",
  "radial-gradient(circle at 30% 75%, rgb(239 72 141 / 0.4), transparent 55%), radial-gradient(circle at 80% 25%, rgb(129 122 224 / 0.45), transparent 60%)",
  "radial-gradient(circle at 70% 70%, rgb(252 166 53 / 0.32), transparent 55%), radial-gradient(circle at 25% 25%, rgb(46 134 239 / 0.45), transparent 60%)",
];

function variant(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % SKIES.length;
}

/** Day and short month in the event's own time zone, for the date stamp. */
function dateStamp(iso: string, locale: string, timeZone?: string | null) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const zone = timeZone ?? undefined;
  try {
    return {
      day: new Intl.DateTimeFormat(locale, { day: "2-digit", timeZone: zone }).format(date),
      month: new Intl.DateTimeFormat(locale, { month: "short", timeZone: zone })
        .format(date)
        .replace(".", ""),
    };
  } catch {
    return null;
  }
}

export function EventCard({
  dict,
  locale,
  event,
  headingLevel = 3,
  basePath = "events",
}: {
  dict: Dictionary;
  locale: string;
  event: EventSummary;
  /** The card title's level: whoever renders the list knows the depth. */
  headingLevel?: 2 | 3;
  /** The segment after the locale for "view event". */
  basePath?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const t = dict.site.events;
  const open = event.registrationState?.state === "OPEN";
  const detailHref = `/${locale}/${basePath}/${event.slug}`;
  const registerHref = platform.register(locale, event.slug);
  const summary = event.publicSummary ?? event.description ?? null;
  const nights = eventNights(event.startDate, event.endDate, event.timeZone);
  const stamp = dateStamp(event.startDate, locale, event.timeZone);
  const place = [event.venue?.city, event.venue?.country].filter(Boolean).join(", ");
  const price =
    event.priceFrom == null
      ? null
      : isZero(event.priceFrom)
        ? t.priceFree
        : t.priceFrom.replace("{price}", formatMoney(event.priceFrom, event.currency, locale));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-card transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-raised">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-space-950">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[var(--dur-reveal)] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SKIES[variant(event.id)] }}>
            <div className="starfield" />
            <span
              className="absolute inset-0 grid place-items-center"
              style={{ filter: "drop-shadow(0 0 22px rgb(129 122 224 / 0.6))" }}
            >
              <Mark variant="color" size={52} alt="" />
            </span>
          </div>
        )}

        <div className="absolute start-3 top-3">
          <EventStateBadge dict={dict} status={event.status} registrationState={event.registrationState} />
        </div>

        {stamp ? (
          <div className="absolute end-3 top-3 flex min-w-14 flex-col items-center rounded-xl bg-surface/95 px-2.5 py-1.5 text-center shadow-card">
            <span className="font-display text-lg font-medium leading-none text-ink">{stamp.day}</span>
            <span className="mt-1 text-xs font-medium capitalize text-ink-muted">{stamp.month}</span>
          </div>
        ) : null}

        {event.logoUrl ? (
          <img
            src={event.logoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute bottom-3 end-3 size-12 rounded-lg border border-line bg-surface object-contain p-1 shadow-card"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {event.type ? (
          <p className="text-xs font-medium text-brand-700">{label(dict, event.type)}</p>
        ) : null}

        <Heading className="mt-1.5 font-display text-lg font-medium leading-snug text-ink">
          <Link href={detailHref} className="hover:text-brand-700">
            {event.name}
          </Link>
        </Heading>

        {event.organization?.name ? (
          <p className="mt-1 text-sm text-ink-subtle">{event.organization.name}</p>
        ) : null}

        <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
          <li className="flex items-center gap-2">
            <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-faint">
              <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {formatDateRange(event.startDate, event.endDate, locale, event.timeZone)}
          </li>
          {place ? (
            <li className="flex items-center gap-2">
              <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-faint">
                <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              {place}
            </li>
          ) : null}
          {nights ? (
            <li className="flex items-center gap-2">
              <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-faint">
                <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              {t.nights.replace("{n}", String(nights))}
            </li>
          ) : null}
        </ul>

        {summary ? <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{summary}</p> : null}

        <div className="flex-1" />

        {price ? (
          <p className="tabular mt-4 text-sm font-semibold text-ink">{price}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={detailHref} className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}>
            {dict.public.viewEvent}
          </Link>
          {open ? (
            <a href={registerHref} className={cn(buttonVariants({ variant: "solid", size: "md" }), "flex-1")}>
              {dict.public.registerNow}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
