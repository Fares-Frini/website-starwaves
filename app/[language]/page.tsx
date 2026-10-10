import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";
import { Hero } from "@/components/home/hero";
import { Trades } from "@/components/home/trades";
import { FormatsBand } from "@/components/home/formats-band";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Journey } from "@/components/home/journey";
import { PlatformSplit } from "@/components/home/platform-split";
import { FinalCta } from "@/components/home/final-cta";
import { publicTryGet, type Paginated } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { SITE_NAME, absolute, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: PageProps<"/[language]">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "",
    title: `${dict.brand.name} — ${dict.site.hero.line1} ${dict.site.hero.line2}`,
    description: dict.site.hero.lead,
    absoluteTitle: true,
  });
}

/**
 * The showcase home page, in the order a visitor needs it: who Starwaves is
 * (the hero and the three trades), what is happening now (the open events),
 * how an event runs with Starwaves, the platform behind it, and the one
 * question to an organiser at the end.
 *
 * It never shows anything about the visitor: every link is the same for
 * everybody. The events are the platform's public catalogue, read anonymously;
 * if the platform cannot be reached, that section says there is nothing to
 * show and the rest of the page stands.
 */
export default async function HomePage({ params }: PageProps<"/[language]">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  const { data, unavailable } = await publicTryGet<Paginated<EventSummary>>("/events/public", { limit: 3 });
  const events = data?.data ?? [];

  return (
    <PublicShell
      dict={dict}
      locale={isLocale(locale) ? locale : DEFAULT_LOCALE}
      tone="space"
    >
      <JsonLd data={siteJsonLd(dict.site.hero.lead)} />
      <Hero dict={dict} locale={locale} />
      <FormatsBand dict={dict} />
      <Trades dict={dict} locale={locale} />
      <UpcomingEvents dict={dict} locale={locale} events={events} unavailable={unavailable} />
      <Journey dict={dict} />
      <PlatformSplit dict={dict} locale={locale} />
      <FinalCta dict={dict} locale={locale} />
    </PublicShell>
  );
}

/**
 * Who publishes the site, for search engines: the organisation (name, website,
 * logo) and the website itself, in both languages. Only what is true and
 * public today — no address, phone or social profiles until they are given.
 */
function siteJsonLd(description: string) {
  const site = absolute("");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: SITE_NAME,
        alternateName: "Starwaves",
        url: site,
        logo: absolute("/brand/sw-ec-color.svg"),
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        name: SITE_NAME,
        url: site,
        inLanguage: ["fr", "en"],
        publisher: { "@id": `${site}/#organization` },
      },
    ],
  };
}
