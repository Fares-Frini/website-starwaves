import { Inter, Unbounded } from "next/font/google";

/*
 * Subsets: only `latin` is *preloaded* — it covers French and English entirely
 * (accents, œ, the typographic apostrophe and spaces, €). next/font preloads
 * every subset listed, and listing `latin-ext` too used to download ~200 KB
 * of glyphs no page shows, on every page, at high priority. The other subsets
 * are still declared (with their unicode ranges), so a rare character — a
 * Polish or Turkish name in an event — still gets its glyph, downloaded only
 * on a page that uses it.
 */

/**
 * Inter, for reading.
 *
 * No brand typeface is supplied — the wordmark is outlined, so it carries no
 * font dependency. Inter covers the capital accents French sets (É, À, Ç), has
 * real tabular figures for prices, and matches the platform the site links to.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Unbounded, for headings only.
 *
 * Wide, geometric capitals in the family of the STARWAVES wordmark — the
 * futuristic note the brand asks for, while staying readable at heading sizes.
 * Never used for body text. `adjustFontFallback` keeps the swap from shifting
 * the layout.
 */
export const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
