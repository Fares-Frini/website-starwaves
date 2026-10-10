import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, markDataUrl } from "@/components/seo/og-card";
import type { PublicEvent } from "@/components/public/event-detail";
import { publicTryGet } from "@/lib/api";
import { formatDateRange } from "@/lib/display";
import { getDictionary } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

/*
 * Each event's own sharing card: its name, its dates and its city, on the
 * site's night sky — what someone needs to recognise the event in a feed.
 * Cached like the page (60 s). If the API cannot be reached, the card falls
 * back to the site's name rather than failing.
 */
export const revalidate = 60;
export function generateStaticParams() {
  return [];
}
export const alt = SITE_NAME;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ language: string; slug: string }> }) {
  const { language, slug } = await params;
  const dict = await getDictionary(language);
  const { data: event } = await publicTryGet<PublicEvent>(`/events/public/${encodeURIComponent(slug)}`);
  const enums = dict.enums as Record<string, string | undefined>;

  const when = event ? formatDateRange(event.startDate, event.endDate, language, event.timeZone) : "";
  const where = event ? [event.venue?.city, event.venue?.country].filter(Boolean).join(", ") : "";

  return new ImageResponse(
    (
      <OgCard
        mark={await markDataUrl()}
        kicker={event ? (enums[event.type] ?? SITE_NAME) : SITE_NAME}
        title={event?.name ?? dict.public.browseTitle}
        subtitle={[when, where].filter(Boolean).join(" · ") || undefined}
      />
    ),
    size,
  );
}
