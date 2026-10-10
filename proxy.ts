import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Proxy (Next.js 16's middleware): puts a language on every path, French by
 * default. That is all it does. There is no session to refresh and no cookie to
 * read, which is the point of this site.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};

function localeFromPath(pathname: string): Locale | null {
  const first = pathname.split("/")[1];
  return LOCALES.includes(first as Locale) ? (first as Locale) : null;
}

/** Best-effort locale for a first visit: their browser, then French. */
function negotiateLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const base = part.split(";")[0].trim().toLowerCase().split("-")[0];
      if (LOCALES.includes(base as Locale)) return base as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (localeFromPath(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiateLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
