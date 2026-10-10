import type { MetadataRoute } from "next";
import { publicGet, type Paginated } from "@/lib/api";
import { SITE_URL } from "@/lib/config";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import type { EventSummary } from "@/lib/types";

/*
 * `/sitemap.xml`: every public page in both languages, each with its
 * language alternates (the same pairs as the pages' `hreflang`), plus every
 * public event. Rebuilt at most every hour; new events also reach search
 * engines through the catalogue's links in between.
 *
 * Legal pages are left out while they are placeholders (they are `noindex`).
 */
export const revalidate = 3600;

const PAGES = [
  "",
  "/events",
  "/about",
  "/contact",
  "/platform",
  "/solutions/congresses",
  "/solutions/corporate",
  "/solutions/productions",
  "/resources/faq",
  "/resources/guides",
];

function entries(path: string): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    "x-default": `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
  };
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    alternates: { languages },
  }));
}

/**
 * All public event slugs, a hundred at a time (the API's page limit). If the
 * API cannot be reached the sitemap still lists the site's own pages: a
 * shorter sitemap is fine, a failing one is not.
 */
async function eventPaths(): Promise<string[]> {
  const paths: string[] = [];
  try {
    for (let page = 1; page <= 50; page++) {
      const result = await publicGet<Paginated<EventSummary>>("/events/public", { page, limit: 100 }, 3600);
      if (!result) break;
      paths.push(...result.data.map((event) => `/events/${event.slug}`));
      if (!result.meta.hasNextPage) break;
    }
  } catch {
    // Unavailable: keep what was read.
  }
  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await eventPaths();
  return [...PAGES, ...events].flatMap(entries);
}
