import Link from "next/link";
import { Card, buttonClass } from "@/components/ui";
import { platform } from "@/lib/platform";
import { PublicShell } from "@/components/public/public-shell";
import { BackLink } from "@/components/ui/back-link";
import type { Dictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

/**
 * One marketing page.
 *
 * Every page in §15.1 has the same shape — a title, a lead, some sections, and
 * a pair of calls to action — so they share one renderer and differ only in
 * their copy, which lives in the dictionary and is therefore translated by
 * construction rather than by remembering.
 *
 * Both calls to action are real destinations that exist: browsing events needs
 * no account, and the second is sign-up or, for someone already signed in,
 * their own space. A marketing page whose buttons 404 is worse than one with
 * no buttons.
 */
export interface MarketingCopy {
  title: string;
  lead: string;
  /** `readonly`, because the dictionary is `as const` and its arrays are too. */
  readonly sections: readonly { readonly heading: string; readonly body: string }[];
}

export function MarketingPage({
  dict,
  locale,
  page,
}: {
  dict: Dictionary;
  locale: string;
  page: MarketingCopy;
}) {
  return (
    <PublicShell
      dict={dict}
      locale={isLocale(locale) ? locale : DEFAULT_LOCALE}
    >
      <div className="mx-auto max-w-2xl">
        <BackLink href={`/${locale}`} label={dict.brand.name} />

        <header className="mb-6 mt-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {page.title}
          </h1>
          <p className="mt-2 text-lg text-ink-muted">{page.lead}</p>
        </header>

        <Card>
          <div className="space-y-5">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-semibold text-ink">{section.heading}</h2>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/${locale}/events`}
            className={buttonClass("primary", "md")}
          >
            {dict.home.heroBrowse}
          </Link>
          <a
            href={platform.signUp(locale)}
            className={buttonClass("secondary", "md")}
          >
            {dict.auth.signUpShort}
          </a>
        </div>
      </div>
    </PublicShell>
  );
}
