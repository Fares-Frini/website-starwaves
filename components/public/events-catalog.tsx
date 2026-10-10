import { EventCard } from "@/components/public/event-card";
import { ChipFilter, Pagination, SearchBox } from "@/components/ui/list-controls";
import { ListBody, ListProvider } from "@/components/ui/list-context";
import { Mark } from "@/components/brand/logo";
import type { Paginated } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

/** The event formats the API knows, in the order a visitor thinks of them. */
const EVENT_TYPES = ["CONGRESS", "CONFERENCE", "SEMINAR", "WORKSHOP", "COMPETITION", "MEETING", "OTHER"] as const;

/**
 * The event catalogue: a night header with the title, a search and the event
 * types, then the cards on a light ground where dates and prices read easily,
 * then the pages.
 *
 * Search, type and page all live in the URL (`ListProvider`), so a filtered
 * view can be shared and survives a reload; the page reading them stays a
 * Server Component. Identical for every visitor.
 */
export function EventsCatalog({
  dict,
  locale,
  title,
  subtitle,
  data,
  meta,
  eventBasePath = "events",
  unavailable = false,
}: {
  dict: Dictionary;
  locale: string;
  title: string;
  subtitle: string;
  data: EventSummary[];
  meta: Paginated<EventSummary>["meta"];
  /** Forwarded to `EventCard`. */
  eventBasePath?: string;
  /** The API could not be reached: say so rather than "no events". */
  unavailable?: boolean;
}) {
  const enums = dict.enums as Record<string, string | undefined>;

  return (
    <ListProvider>
      <section className="theme-space relative isolate overflow-hidden bg-space-950">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="starfield starfield-twinkle" />
          <div
            className="nebula -top-40 end-[-6%] size-[34rem] animate-drift"
            style={{ background: "radial-gradient(closest-side, rgb(46 134 239 / 0.35), transparent)" }}
          />
          <div
            className="nebula -bottom-48 start-1/4 size-[30rem] animate-drift-slow"
            style={{ background: "radial-gradient(closest-side, rgb(239 72 141 / 0.22), transparent)" }}
          />
        </div>
        <div className="container-site relative pb-14 pt-16 sm:pt-20">
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-display text-h1 font-medium text-starlight">{title}</h1>
              <p className="mt-4 text-lead text-starlight-muted">{subtitle}</p>
            </div>
            <span
              aria-hidden
              className="hidden shrink-0 md:block"
              style={{ filter: "drop-shadow(0 0 30px rgb(129 122 224 / 0.55))" }}
            >
              <Mark variant="color" size={96} alt="" />
            </span>
          </div>

          <div className="mt-10 space-y-4">
            <SearchBox placeholder={dict.screens.searchPlaceholder} label={dict.common.search} tone="dark" />
            <ChipFilter
              name="type"
              label={dict.site.events.filterLabel}
              allLabel={dict.site.events.allTypes}
              options={EVENT_TYPES.map((value) => ({ value, label: enums[value] ?? value }))}
            />
          </div>
        </div>
        <div aria-hidden className="hairline-brand opacity-70" />
      </section>

      <section className="bg-surface-sunken">
        <div className="container-site py-12 sm:py-16">
          <ListBody>
            {data.length === 0 ? (
              <div className="rounded-panel border border-dashed border-line-strong px-6 py-16 text-center">
                <p className="font-display text-h3 font-medium text-ink">
                  {unavailable ? dict.site.unavailable.title : dict.public.browseEmpty}
                </p>
                <p className="mx-auto mt-3 max-w-md text-ink-muted">
                  {unavailable ? dict.site.unavailable.body : dict.public.browseEmptyHint}
                </p>
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((event) => (
                  <li key={event.id}>
                    <EventCard dict={dict} locale={locale} event={event} headingLevel={2} basePath={eventBasePath} />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10">
              <Pagination
                page={meta.page}
                pageCount={meta.pageCount}
                total={meta.total}
                hasNext={meta.hasNextPage}
                hasPrevious={meta.hasPreviousPage}
                labels={{
                  previous: dict.screens.previous,
                  next: dict.screens.next,
                  page: dict.screens.page,
                  of: dict.screens.of,
                  results: dict.screens.resultsCount,
                }}
              />
            </div>
          </ListBody>
        </div>
      </section>
    </ListProvider>
  );
}
