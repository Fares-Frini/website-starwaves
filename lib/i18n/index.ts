import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/fr";

/**
 * Dictionaries are imported dynamically so a locale's strings only reach the
 * bundle of a page that actually renders in it.
 */
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  fr: () => import("./dictionaries/fr"),
  en: () => import("./dictionaries/en"),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const mod = await loaders[key]();
  return mod.default;
}

export type { Dictionary };
export { DEFAULT_LOCALE, isLocale };
export type { Locale };
