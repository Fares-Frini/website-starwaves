import Link from "next/link";
import { Logo, Mark } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import { Button } from "@/components/ui/button";
import { platform } from "@/lib/platform";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { siteNav } from "./nav-model";
import { SiteNav } from "./site-nav";
import { MobileNav } from "./mobile-nav";

/**
 * The header of every page: the night bar with the logo, the navigation, and
 * the two ways out — signing in to the platform (for people already
 * registered) and the main action of the site, talking to Starwaves about an
 * event.
 *
 * The frosted-glass blur is desktop-only: on a phone, blurring whatever
 * scrolls under the bar is redrawn on every scroll frame for a difference a
 * 95%-opaque bar does not show.
 *
 * It never shows who is signed in: the site has no session and reads no
 * cookie, so it can be cached and served the same to everybody. "Sign in" is a
 * plain link; the platform decides what happens next.
 */
export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const entries = siteNav(dict, locale);
  const contact = `/${locale}/contact`;

  return (
    <header className="sticky top-0 z-40 bg-space-950/95 lg:bg-space-950/90 lg:backdrop-blur-xl">
      <div className="container-site flex h-16 items-center gap-4">
        <Link href={`/${locale}`} aria-label={dict.brand.logoAlt} className="shrink-0">
          <span className="sm:hidden">
            <Mark variant="color" size={30} alt="" />
          </span>
          <span className="hidden sm:inline">
            <Logo lockup="sw-ec" variant="color-white" height={30} priority alt="" />
          </span>
        </Link>

        <div className="ms-4 hidden lg:block">
          <SiteNav entries={entries} label={dict.nav.primary} />
        </div>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden md:inline-flex">
            <LocaleSwitcher current={locale} label={dict.common.languageLabel} tone="dark" />
          </span>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <a href={platform.signIn(locale)}>{dict.auth.signIn}</a>
          </Button>
          <Button asChild variant="nova" size="sm" className="hidden sm:inline-flex">
            <Link href={contact}>{dict.site.nav.organise}</Link>
          </Button>
          <MobileNav
            entries={entries}
            labels={{
              open: dict.site.nav.openMenu,
              close: dict.site.nav.closeMenu,
              title: dict.site.nav.menuTitle,
            }}
            primary={{ href: contact, label: dict.site.nav.organise }}
            secondary={{ href: platform.signIn(locale), label: dict.auth.signIn }}
            footer={
              <LocaleSwitcher current={locale} label={dict.common.languageLabel} tone="dark" />
            }
          />
        </div>
      </div>
      {/* The brand's sweep, faint, as the header's lower edge. */}
      <div aria-hidden className="hairline-brand opacity-40" />
    </header>
  );
}
