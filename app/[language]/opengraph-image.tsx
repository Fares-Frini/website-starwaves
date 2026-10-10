import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, markDataUrl } from "@/components/seo/og-card";
import { getDictionary } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";
import { LOCALES } from "@/lib/i18n/config";

/*
 * The site's sharing card, in each language: every page under `/[language]`
 * uses it unless it has its own (an event's card, or its uploaded cover).
 * Built once per language at build time — a static PNG, no work per request.
 */
export const alt = SITE_NAME;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((language) => ({ language }));
}

export default async function Image({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  const dict = await getDictionary(language);
  return new ImageResponse(
    (
      <OgCard
        mark={await markDataUrl()}
        kicker={SITE_NAME}
        title={dict.site.hero.line1}
        gradientTitle={dict.site.hero.line2}
      />
    ),
    size,
  );
}
