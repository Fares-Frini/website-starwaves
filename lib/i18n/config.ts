/**
 * Locales.
 *
 * French is the primary audience and the default. Arabic is deliberately not
 * enabled yet — but strings are externalised and no layout assumes a writing
 * direction, so adding `ar` later is a dictionary plus `dir="rtl"`, not a
 * rewrite. `dir` is already emitted per-locale for that reason.
 */
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Written direction. All `ltr` today; the plumbing exists for `ar`. */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
