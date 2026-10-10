import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";
import { EventsCatalog } from "@/components/public/events-catalog";
import { EMPTY_PAGE, publicTryGet, type Paginated } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/events">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  // One canonical address for the catalogue: search, type and page variants
  // all point back to it, so they never compete with it in results.
  return pageMetadata({
    locale,
    path: "/events",
    title: dict.public.browseTitle,
    description: dict.site.seo.events,
  });
}

/**
 * The public event catalogue.
 *
 * Read anonymously from the platform's public API, so it is the same for every
 * visitor and shows nothing about who is looking. If the platform cannot be
 * reached the page says the list is unavailable for now (not "no events"),
 * and the rest of the site stays up.
 */
export default async function PublicEventsPage({
  params,
  searchParams,
}: PageProps<"/[language]/events">) {
  const { language: locale } = await params;
  const query = await searchParams;
  const dict = await getDictionary(locale);

  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const search = typeof query.search === "string" ? query.search : undefined;
  // One of the API's event types, passed through as the public list's own filter.
  const type = typeof query.type === "string" ? query.type : undefined;

  const result = await publicTryGet<Paginated<EventSummary>>("/events/public", {
    page,
    limit: 12,
    search,
    type,
  });
  const { data, meta } = result.data ?? EMPTY_PAGE<EventSummary>();

  return (
    <PublicShell dict={dict} locale={isLocale(locale) ? locale : DEFAULT_LOCALE} tone="space">
      <EventsCatalog
        dict={dict}
        locale={locale}
        title={dict.public.browseTitle}
        subtitle={dict.public.browseSubtitle}
        data={data}
        meta={meta}
        eventBasePath="events"
        unavailable={result.unavailable}
      />
    </PublicShell>
  );
}
