import type { Dictionary } from "@/lib/i18n";

/**
 * The site's navigation, in one place: the header, its mobile menu and the
 * footer all read this, so a page added here appears in all three.
 *
 * Every entry is an existing route; labels and one-line descriptions come from
 * the dictionary's existing copy (each page's own title and lead).
 */
export interface NavLink {
  href: string;
  label: string;
  /** One line under the label in the dropdowns. */
  hint?: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export function isGroup(entry: NavEntry): entry is NavGroup {
  return "links" in entry;
}

export function siteNav(dict: Dictionary, locale: string): NavEntry[] {
  const m = dict.marketing;
  return [
    { href: `/${locale}/events`, label: dict.nav.events },
    {
      label: dict.site.nav.services,
      links: [
        { href: `/${locale}/solutions/congresses`, label: m.congresses.title, hint: m.congresses.lead },
        { href: `/${locale}/solutions/corporate`, label: m.corporate.title, hint: m.corporate.lead },
        { href: `/${locale}/solutions/productions`, label: m.productions.title, hint: m.productions.lead },
        { href: `/${locale}/platform`, label: m.platform.title, hint: m.platform.lead },
      ],
    },
    { href: `/${locale}/about`, label: dict.nav.about },
    {
      label: dict.site.nav.resources,
      links: [
        { href: `/${locale}/resources/faq`, label: m.faq.title, hint: m.faq.lead },
        { href: `/${locale}/resources/guides`, label: m.guides.title, hint: m.guides.lead },
      ],
    },
    { href: `/${locale}/contact`, label: m.contact.title },
  ];
}

/** The footer's columns: everything above, plus the legal pages. */
export function footerColumns(dict: Dictionary, locale: string): NavGroup[] {
  const m = dict.marketing;
  return [
    {
      label: dict.site.footer.explore,
      links: [
        { href: `/${locale}/events`, label: dict.nav.events },
        { href: `/${locale}/platform`, label: m.platform.title },
      ],
    },
    {
      label: dict.site.nav.services,
      links: [
        { href: `/${locale}/solutions/congresses`, label: m.congresses.title },
        { href: `/${locale}/solutions/corporate`, label: m.corporate.title },
        { href: `/${locale}/solutions/productions`, label: m.productions.title },
      ],
    },
    {
      label: dict.site.footer.company,
      links: [
        { href: `/${locale}/about`, label: dict.nav.about },
        { href: `/${locale}/contact`, label: m.contact.title },
        { href: `/${locale}/resources/faq`, label: m.faq.title },
        { href: `/${locale}/resources/guides`, label: m.guides.title },
      ],
    },
    {
      label: dict.site.footer.legal,
      links: [
        { href: `/${locale}/legal/terms`, label: dict.legal.terms.title },
        { href: `/${locale}/legal/privacy`, label: dict.legal.privacy.title },
        { href: `/${locale}/legal/cookies`, label: dict.legal.cookies.title },
      ],
    },
  ];
}
