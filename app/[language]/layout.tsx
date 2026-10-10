import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { inter, unbounded } from "@/lib/fonts";
import { SITE_URL } from "@/lib/config";
import { LOCALES, LOCALE_DIR, isLocale } from "@/lib/i18n/config";
import { INDEXABLE, SITE_NAME } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  // Resolves the relative URLs of every page's metadata (canonical, social images).
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · Starwaves",
  },
  applicationName: SITE_NAME,
  // A local or staging copy stays out of search results (see `INDEXABLE`).
  ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
  description:
    "Starwaves Events & Congresses : organisation d’événements et de congrès, et la plateforme qui les fait tourner.",
  icons: {
    icon: [{ url: "/brand/mark-color.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/mark-color.svg" }],
  },
};

export const viewport: Viewport = {
  // The night of the header and hero, so the browser chrome continues it.
  themeColor: "#060914",
};

/** Both locales are known at build time, so both prerender. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ language: locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[language]">) {
  const { language: locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={LOCALE_DIR[locale]}
      className={`${inter.variable} ${unbounded.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
