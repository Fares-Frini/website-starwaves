/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import { formatMoney, isZero } from "@/lib/money";
import { formatDate, formatDateRange, label } from "@/lib/display";
import { eventNights } from "@/lib/event-nights";
import { EventStateBadge } from "@/components/public/event-state-badge";
import type { RegistrationStateView } from "@/lib/types";

/** What `GET /events/public/:idOrSlug` returns. */
export interface PublicEvent {
  id: string;
  name: string;
  slug: string;
  status: string;
  type: string;
  description?: string | null;
  publicSummary?: string | null;
  startDate: string;
  endDate?: string | null;
  registrationDeadline?: string | null;
  capacity?: number | null;
  currency: string;
  timeZone?: string | null;
  websiteUrl?: string | null;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  organization?: { id: string; name: string } | null;
  venue?: {
    name?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  /** The programme as organisers publish it — drafts never reach this page. */
  sessions?: {
    id: string;
    title: string;
    speaker?: string | null;
    room?: string | null;
    startTime: string;
    track?: { name: string } | null;
  }[];
  registrationCategories?: {
    id: string;
    name: string;
    description?: string | null;
    price?: string | null;
  }[];
  /** Taking registrations now? Computed by the API from the status, the
   *  organiser opening registration, dates and seats. */
  registrationState?: RegistrationStateView;
  /** Fields held back from this reader, and the level that would unlock each. */
  restricted?: Record<string, string>;
  accommodations?: {
    id: string;
    name: string;
    location?: string | null;
    description?: string | null;
    bannerUrl?: string | null;
  }[];
  infoBlocks?: { id: string; title: string; body: string }[];
}

/**
 * One event's own page.
 *
 * A night masthead — the event's banner when it has one, the Starwaves sky
 * when it does not — with what it is, when, where and the way in; then, on a
 * light ground, what a visitor reads before deciding: about, prices, the
 * programme, where people stay, practical blocks. The registration panel
 * stays in view beside them.
 *
 * Identical for every visitor. "Register" is a link to the platform, which
 * asks for sign-in if needed. Whether registration is open is the API's
 * answer (`registrationState`), never guessed from the status here.
 */
export function EventDetail({
  dict,
  locale,
  event,
  registerHref,
  signInHref,
  backHref,
  backLabel,
}: {
  dict: Dictionary;
  locale: string;
  event: PublicEvent;
  registerHref: string;
  /** The event inside the platform, for what the public page holds back. */
  signInHref: string;
  backHref: string;
  backLabel: string;
}) {
  const t = dict.site.events;
  const state = event.registrationState?.state;
  const open = state === "OPEN";
  const closedText =
    state === "FULL"
      ? dict.public.registrationFull
      : state === "CLOSED"
        ? dict.public.registrationClosed
        : dict.public.registrationOpeningSoon;

  const nights = eventNights(event.startDate, event.endDate, event.timeZone);
  const categories = event.registrationCategories ?? [];
  // The lowest listed price, compared as numbers but shown as the API wrote it.
  const priced = categories.filter((c) => c.price != null);
  const lowest = priced.length
    ? priced.reduce((min, c) => (Number(c.price) < Number(min.price) ? c : min))
    : null;
  const priceLine = lowest?.price
    ? isZero(lowest.price)
      ? t.priceFree
      : t.priceFrom.replace("{price}", formatMoney(lowest.price, event.currency, locale))
    : null;

  const place = event.venue
    ? [event.venue.name, event.venue.city].filter(Boolean).join(", ")
    : "";
  const fullAddress = event.venue
    ? [event.venue.name, event.venue.address, event.venue.city, event.venue.country]
        .filter(Boolean)
        .join(", ")
    : "";
  const restricted = Object.values(event.restricted ?? {});
  const programme = event.sessions ?? [];
  const accommodations = event.accommodations ?? [];
  const blocks = event.infoBlocks ?? [];
  const about = event.description ?? event.publicSummary;

  return (
    <>
      {/* ---------------------------------------------------- the masthead */}
      <section className="theme-space relative isolate overflow-hidden bg-space-950">
        <div aria-hidden className="absolute inset-0 -z-10">
          {event.coverImageUrl ? (
            <>
              {/* The masthead picture is the page's largest element: fetched first. */}
              <img
                src={event.coverImageUrl}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/80 to-space-950/40" />
            </>
          ) : (
            <>
              <div className="starfield starfield-twinkle" />
              <div
                className="nebula -top-40 end-[-8%] size-[40rem] animate-drift"
                style={{ background: "radial-gradient(closest-side, rgb(46 134 239 / 0.38), transparent)" }}
              />
              <div
                className="nebula -bottom-56 start-[10%] size-[34rem] animate-drift-slow"
                style={{ background: "radial-gradient(closest-side, rgb(215 107 242 / 0.25), transparent)" }}
              />
            </>
          )}
        </div>

        <div className="container-site relative pb-16 pt-10 sm:pb-20">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-starlight-subtle transition-colors hover:text-starlight"
          >
            <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none" className="rtl:rotate-180">
              <path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>

          <div className="mt-10 flex items-start justify-between gap-8">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <EventStateBadge dict={dict} status={event.status} registrationState={event.registrationState} />
                <span className="rounded-full border border-space-line-strong px-3 py-0.5 text-sm text-starlight-muted">
                  {label(dict, event.type)}
                </span>
              </div>

              <h1 className="mt-5 font-display text-h1 font-medium text-starlight">{event.name}</h1>

              <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-starlight-muted">
                <li className="flex items-center gap-2">
                  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-nova-blue">
                    <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {formatDateRange(event.startDate, event.endDate, locale, event.timeZone)}
                </li>
                {place ? (
                  <li className="flex items-center gap-2">
                    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-nova-pink">
                      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    {place}
                  </li>
                ) : null}
                {nights ? (
                  <li className="flex items-center gap-2">
                    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-nova-amber">
                      <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    </svg>
                    {t.nights.replace("{n}", String(nights))}
                  </li>
                ) : null}
                {event.organization ? (
                  <li className="flex items-center gap-2">
                    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-nova-violet">
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M3 13.5c.8-2.3 2.7-3.5 5-3.5s4.2 1.2 5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    {event.organization.name}
                  </li>
                ) : null}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {open ? (
                  <Button asChild variant="nova" size="lg">
                    <a href={registerHref}>{dict.public.registerNow}</a>
                  </Button>
                ) : (
                  <span className="rounded-full border border-space-line-strong px-5 py-3 text-sm text-starlight-muted">
                    {closedText}
                  </span>
                )}
                {priceLine ? <span className="tabular text-starlight">{priceLine}</span> : null}
              </div>
            </div>

            {event.logoUrl ? (
              <img
                src={event.logoUrl}
                alt=""
                className="hidden size-24 shrink-0 rounded-2xl border border-space-line bg-white object-contain p-2 shadow-panel md:block"
              />
            ) : null}
          </div>
        </div>
        <div aria-hidden className="hairline-brand opacity-70" />
      </section>

      {/* ---------------------------------------------------- the reading */}
      <section className="bg-surface-sunken">
        <div className="container-site grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="min-w-0 space-y-14">
            {about ? (
              <section>
                <h2 className="font-display text-h3 font-medium text-ink">{t.aboutTitle}</h2>
                <p className="mt-4 max-w-prose whitespace-pre-line text-lg leading-relaxed text-ink-muted">{about}</p>
              </section>
            ) : null}

            <section>
              <h2 className="font-display text-h3 font-medium text-ink">{dict.public.fees}</h2>
              {nights ? (
                <p className="mt-2 text-sm text-ink-subtle">{t.nights.replace("{n}", String(nights))}</p>
              ) : null}
              {categories.length === 0 ? (
                <p className="mt-4 text-ink-muted">{dict.public.noFees}</p>
              ) : (
                <ul className="mt-5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-surface">
                  {categories.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-6 px-6 py-5">
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{c.name}</p>
                        {c.description ? <p className="mt-1 text-sm text-ink-subtle">{c.description}</p> : null}
                      </div>
                      <p className="tabular shrink-0 font-display text-lg font-medium text-ink">
                        {c.price != null
                          ? isZero(c.price)
                            ? t.priceFree
                            : formatMoney(c.price, event.currency, locale)
                          : "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {programme.length > 0 ? (
              <section>
                <h2 className="font-display text-h3 font-medium text-ink">{dict.public.schedule}</h2>
                <ol className="mt-5 space-y-3">
                  {programme.map((s) => (
                    <li key={s.id} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface px-5 py-4 sm:flex-row sm:gap-6">
                      <span className="tabular w-44 shrink-0 text-sm text-brand-700">
                        {formatDate(s.startTime, locale, event.timeZone)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{s.title}</span>
                        {[s.speaker, s.room, s.track?.name].filter(Boolean).length ? (
                          <span className="mt-0.5 block text-sm text-ink-subtle">
                            {[s.speaker, s.room, s.track?.name].filter(Boolean).join(", ")}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {accommodations.length > 0 ? (
              <section>
                <h2 className="font-display text-h3 font-medium text-ink">{dict.public.accommodationTitle}</h2>
                <p className="mt-2 text-sm text-ink-subtle">{t.accommodationHint}</p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {accommodations.map((a) => (
                    <li key={a.id} className="overflow-hidden rounded-panel border border-line bg-surface">
                      {a.bannerUrl ? (
                        <img src={a.bannerUrl} alt="" loading="lazy" className="h-36 w-full object-cover" />
                      ) : null}
                      <div className="p-5">
                        <p className="font-medium text-ink">{a.name}</p>
                        {a.location ? <p className="mt-0.5 text-sm text-ink-subtle">{a.location}</p> : null}
                        {a.description ? <p className="mt-2 text-sm text-ink-muted">{a.description}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {blocks.length > 0 ? (
              <section>
                <h2 className="font-display text-h3 font-medium text-ink">{dict.public.practicalInfo}</h2>
                <div className="mt-5 space-y-4">
                  {blocks.map((block) => (
                    <article key={block.id} className="rounded-2xl border border-line bg-surface px-6 py-5">
                      <h3 className="font-medium text-ink">{block.title}</h3>
                      <p className="mt-1.5 whitespace-pre-line text-ink-muted">{block.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* The way in, kept in view while the page is read. */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-panel border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-medium text-ink">{t.registerTitle}</h2>
                <EventStateBadge dict={dict} status={event.status} registrationState={event.registrationState} />
              </div>
              {priceLine ? <p className="tabular mt-4 text-2xl font-semibold text-ink">{priceLine}</p> : null}
              {event.registrationDeadline ? (
                <p className="mt-2 text-sm text-ink-muted">
                  {dict.public.deadline} : {formatDate(event.registrationDeadline, locale, event.timeZone)}
                </p>
              ) : null}
              {open ? (
                <>
                  <Button asChild variant="solid" size="lg" className="mt-5 w-full">
                    <a href={registerHref}>{dict.public.registerNow}</a>
                  </Button>
                  <p className="mt-3 text-xs leading-relaxed text-ink-subtle">{t.registerHint}</p>
                </>
              ) : (
                <p className="mt-5 rounded-xl bg-surface-sunken px-4 py-3 text-sm text-ink-muted">{closedText}</p>
              )}
            </div>

            <div className="rounded-panel border border-line bg-surface p-6">
              <h2 className="font-display text-lg font-medium text-ink">{t.venueTitle}</h2>
              <dl className="mt-4 space-y-4 text-sm">
                {fullAddress ? (
                  <div>
                    <dt className="text-ink-subtle">{dict.public.venue}</dt>
                    <dd className="mt-0.5 text-ink">{fullAddress}</dd>
                  </div>
                ) : null}
                {event.organization ? (
                  <div>
                    <dt className="text-ink-subtle">{dict.public.organiser}</dt>
                    <dd className="mt-0.5 text-ink">{event.organization.name}</dd>
                  </div>
                ) : null}
                {event.contactEmail ? (
                  <div>
                    <dt className="text-ink-subtle">{dict.public.contact}</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${event.contactEmail}`} className="break-all text-brand-700 underline underline-offset-2">
                        {event.contactEmail}
                      </a>
                      {event.contactPhone ? <span className="mt-0.5 block text-ink">{event.contactPhone}</span> : null}
                    </dd>
                  </div>
                ) : null}
                {event.websiteUrl ? (
                  <div>
                    <dt className="text-ink-subtle">{dict.public.website}</dt>
                    <dd className="mt-0.5">
                      <a
                        href={event.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-brand-700 underline underline-offset-2"
                      >
                        {event.websiteUrl}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              {restricted.length > 0 ? (
                <p role="note" className="mt-5 border-t border-line pt-4 text-xs text-ink-subtle">
                  <a href={signInHref} className="text-brand-700 underline underline-offset-2">
                    {dict.public.restrictedSignIn}
                  </a>
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
