import type { Metadata } from "next";
import { SITE_URL } from "./config";
import { DEFAULT_LOCALE, LOCALES, type Locale, isLocale } from "./i18n/config";

/**
 * Search and sharing metadata, built the same way for every page.
 *
 * Each page passes its own title, description and path (without the locale);
 * this adds what search engines and social networks need around them:
 * - the canonical address of this language version;
 * - `hreflang` alternates for every language, plus `x-default` (French, the
 *   default), because every page exists in both — Google uses them to show
 *   each visitor the right one and to treat the pair as one page;
 * - Open Graph and Twitter cards, with the site's sharing card in the page's
 *   language (`app/[language]/opengraph-image.tsx`). It is named explicitly,
 *   because an image file does not reach a page that sets its own Open Graph
 *   data. An event page passes its own card (`events/[slug]/opengraph-image.tsx`).
 */

export const SITE_NAME = "Starwaves Events & Congresses";

/** `og:locale` wants a territory. */
const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/**
 * Whether search engines may index this deployment. Off on a local address and
 * when `SITE_NOINDEX=1` (a staging copy), so only the real site gets indexed.
 */
export const INDEXABLE =
  process.env.SITE_NOINDEX !== "1" && !/localhost|127\.0\.0\.1/.test(SITE_URL);

export function alternates(locale: string, path: string): Metadata["alternates"] {
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${DEFAULT_LOCALE}${path}`,
    },
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  absoluteTitle = false,
  images,
}: {
  locale: string;
  /** The page's path after the locale: "" for home, "/events", "/about"… */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** Use the title as is, without the " · Starwaves" suffix (the home page). */
  absoluteTitle?: boolean;
  /** Only when the page has a better picture than the site's card. */
  images?: { url: string; alt?: string; width?: number; height?: number }[];
}): Metadata {
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const cards = images ?? [{ url: `/${lang}/opengraph-image`, width: 1200, height: 630, alt: SITE_NAME }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url: `/${lang}${path}`,
      title,
      description,
      images: cards,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cards.map((card) => card.url),
    },
  };
}

/**
 * Shortens text for a meta description (about 155 characters) at a word
 * boundary, so search results show a whole phrase rather than a cut word.
 */
export function clip(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "")}…`;
}

/** An absolute address on this site, for structured data. */
export const absolute = (path: string) => `${SITE_URL}${path}`;
