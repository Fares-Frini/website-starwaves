import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

/**
 * 404.
 *
 * The wording is careful and the reason is in the API contract: an out-of-scope
 * read returns **404, not 403**, so reaching another client's event looks
 * exactly like a page that does not exist. This must therefore never say
 * "deleted" or "removed" — telling somebody their event is gone when it is
 * merely outside their scope is worse than saying nothing.
 *
 * Two exits, because a terminal page whose only way out is the browser chrome
 * is a bug.
 *
 * `not-found.tsx` cannot read route params, so the locale is not available
 * here; links go to the unprefixed root and the proxy negotiates from there.
 */
export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="tabular text-5xl font-semibold tracking-tight text-ink-faint">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        {dict.errors.notFoundTitle}
      </h1>
      <p className="mt-2 text-ink-muted">{dict.errors.notFoundBody}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonClass("primary", "md")}>
          {dict.errors.backHome}
        </Link>
        <Link href="/events" className={buttonClass("secondary", "md")}>
          {dict.nav.events}
        </Link>
      </div>
    </main>
  );
}
