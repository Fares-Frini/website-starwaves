import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/**
 * The frame of every page on the showcase site: the night header, the page,
 * the night footer.
 *
 * Two kinds of page sit inside it:
 *  - `space` pages compose their own full-width sections, light and dark (the
 *    home page and, as they are redesigned, the others);
 *  - `light` pages (the default) are reading pages — their content sits in the
 *    site's column on the light surface, between the dark header and footer.
 *
 * **It never shows who is signed in, because it does not know.** The site has
 * no session, reads no cookie and calls no authenticated endpoint, which is
 * what lets every page be cached and served the same to everybody.
 */
export function PublicShell({
  dict,
  locale,
  children,
  tone = "light",
}: {
  dict: Dictionary;
  locale: Locale;
  children: React.ReactNode;
  tone?: "light" | "space";
}) {
  return (
    <div className="flex min-h-screen flex-col bg-space-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-starlight focus:px-4 focus:py-2 focus:text-space-950"
      >
        {dict.common.skipToContent}
      </a>

      <SiteHeader dict={dict} locale={locale} />

      <main id="main" className={tone === "space" ? "flex-1" : "flex-1 bg-surface-sunken"}>
        {tone === "space" ? children : <div className="container-site py-10">{children}</div>}
      </main>

      <SiteFooter dict={dict} locale={locale} />
    </div>
  );
}
