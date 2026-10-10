import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { footerColumns } from "./nav-model";

/**
 * The footer: the logo and what Starwaves does, every page of the site in
 * four columns, and the language switch.
 *
 * Contact details are not known yet, so the footer says they are coming
 * rather than inventing any; the same goes for social links and partners,
 * which are left out until they are supplied.
 */
export function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const columns = footerColumns(dict, locale);

  return (
    <footer className="theme-space relative overflow-hidden bg-space-950">
      <div aria-hidden className="hairline-brand opacity-60" />
      <div
        aria-hidden
        className="nebula -bottom-48 -start-40 size-[32rem] opacity-30"
        style={{ background: "radial-gradient(closest-side, rgb(129 122 224 / 0.45), transparent)" }}
      />

      <div className="container-site relative grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <Logo lockup="sw-ec" variant="color-white" height={34} alt={dict.brand.logoAlt} />
          <p className="mt-5 text-sm leading-relaxed text-starlight-muted">
            {dict.site.footer.tagline}
          </p>
          <p className="mt-2 text-sm text-starlight-subtle">{dict.site.footer.contactSoon}</p>
        </div>

        <nav aria-label={dict.nav.footer} className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.label}>
              <p className="text-sm font-medium text-starlight">{column.label}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-starlight-subtle transition-colors hover:text-starlight"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="relative border-t border-space-line">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-starlight-subtle">
          <p>
            {dict.brand.name} — {dict.brand.tagline}
          </p>
          <LocaleSwitcher current={locale} label={dict.common.languageLabel} tone="dark" />
        </div>
      </div>
    </footer>
  );
}
