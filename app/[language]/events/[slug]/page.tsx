import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { EventDetail, type PublicEvent } from "@/components/public/event-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { publicGet } from "@/lib/api";
import { platform } from "@/lib/platform";
import { formatDateRange } from "@/lib/display";
import { absolute, clip, pageMetadata } from "@/lib/seo";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

/*
 * Incremental static regeneration: no event page is built in advance, each one
 * is rendered on its first visit, then served from cache and refreshed at most
 * every 60 s (the API data's own lifetime). Cacheable by a CDN, unlike a page
 * rendered on every request. If a refresh fails because the API is down, the
 * last good page keeps being served.
 */
export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

/**
 * One read per render for the metadata, the page and the structured data
 * (`cache`). `null` means the API says there is no such public event; an
 * outage throws instead — a temporary error page, never a 404 that would get
 * the event dropped from search results.
 */
const loadEvent = cache((slug: string) =>
  publicGet<PublicEvent>(`/events/public/${encodeURIComponent(slug)}`),
);

/**
 * The search-result description: when and where first (what people scan
 * for), then the organisers' own summary — or, for an event that has none
 * yet, its name and what the page offers, so no two events share a snippet.
 */
function describe(event: PublicEvent, locale: string, dict: Dictionary): string {
  const enums = dict.enums as Record<string, string | undefined>;
  const when = formatDateRange(event.startDate, event.endDate, locale, event.timeZone);
  const where = [event.venue?.city, event.venue?.country].filter(Boolean).join(", ");
  const head = [enums[event.type] ?? null, when, where || null].filter(Boolean).join(" · ");
  const body = event.publicSummary ?? event.description;
  return clip(body ? `${head} — ${body}` : `${head} — ${event.name}. ${dict.site.seo.eventFallback}`);
}

export async function generateMetadata({
  params,
}: PageProps<"/[language]/events/[slug]">): Promise<Metadata> {
  const { language: locale, slug } = await params;
  const event = await loadEvent(slug);
  if (!event) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: `/events/${event.slug}`,
    title: event.name,
    description: describe(event, locale, dict),
    // The event's own card — its name, dates and city — from
    // `opengraph-image.tsx` next to this page (named explicitly: the site's
    // card would otherwise be used).
    images: [{ url: `/${locale}/events/${event.slug}/opengraph-image`, width: 1200, height: 630, alt: event.name }],
  });
}

/**
 * Structured data for search engines: a schema.org `Event`, built only from
 * what the public API returned — nothing is filled in that the event does not
 * say. Prices become offers that point at the registration link. The image is
 * the uploaded cover, or else the event's generated card.
 */
function eventJsonLd(event: PublicEvent, locale: string) {
  const registerUrl = platform.register(locale, event.slug);
  const state = event.registrationState?.state;
  const pageUrl = absolute(`/${locale}/events/${event.slug}`);
  const offers = (event.registrationCategories ?? [])
    .filter((c) => c.price != null)
    .map((c) => ({
      "@type": "Offer",
      name: c.name,
      price: c.price,
      priceCurrency: event.currency,
      url: registerUrl,
      ...(state === "OPEN"
        ? { availability: "https://schema.org/InStock" }
        : state === "FULL"
          ? { availability: "https://schema.org/SoldOut" }
          : {}),
      ...(event.registrationDeadline ? { validThrough: event.registrationDeadline } : {}),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    url: pageUrl,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(event.publicSummary || event.description
      ? { description: event.publicSummary ?? event.description }
      : {}),
    image: [event.coverImageUrl ?? `${pageUrl}/opengraph-image`],
    inLanguage: locale,
    ...(event.venue
      ? {
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            ...(event.venue.name ? { name: event.venue.name } : {}),
            address: {
              "@type": "PostalAddress",
              ...(event.venue.address ? { streetAddress: event.venue.address } : {}),
              ...(event.venue.city ? { addressLocality: event.venue.city } : {}),
              ...(event.venue.country ? { addressCountry: event.venue.country } : {}),
            },
          },
        }
      : {}),
    ...(event.organization
      ? { organizer: { "@type": "Organization", name: event.organization.name } }
      : {}),
    ...(offers.length ? { offers } : {}),
  };
}

/** Home › Events › this event, as search results can show it. */
function breadcrumbJsonLd(event: PublicEvent, locale: string, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.site.seo.homeCrumb, item: absolute(`/${locale}`) },
      { "@type": "ListItem", position: 2, name: dict.site.seo.eventsCrumb, item: absolute(`/${locale}/events`) },
      { "@type": "ListItem", position: 3, name: event.name, item: absolute(`/${locale}/events/${event.slug}`) },
    ],
  };
}

/**
 * One event, as an anonymous visitor sees it. Registering is a link to the
 * platform: this page does not look anything up about the visitor.
 */
export default async function PublicEventPage({
  params,
}: PageProps<"/[language]/events/[slug]">) {
  const { language: locale, slug } = await params;
  const dict = await getDictionary(locale);

  const event = await loadEvent(slug);
  if (!event) notFound();

  return (
    <PublicShell dict={dict} locale={isLocale(locale) ? locale : DEFAULT_LOCALE} tone="space">
      <JsonLd data={eventJsonLd(event, locale)} />
      <JsonLd data={breadcrumbJsonLd(event, locale, dict)} />
      <EventDetail
        dict={dict}
        locale={locale}
        event={event}
        registerHref={platform.register(locale, event.slug)}
        signInHref={platform.event(locale, event.slug)}
        backHref={`/${locale}/events`}
        backLabel={dict.public.backToEvents}
      />
    </PublicShell>
  );
}
