import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { PublicShell } from "@/components/public/public-shell";
import { BackLink } from "@/components/ui/back-link";
import { LEGAL, LEGAL_DOCUMENTS, isLegalSlug } from "@/lib/legal";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/display";
import { clip, pageMetadata } from "@/lib/seo";

/** Prerendered: these change rarely and are linked from a consent checkbox. */
export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((document) => ({ document }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[language]/legal/[document]">): Promise<Metadata> {
  const { language: locale, document } = await params;
  if (!isLegalSlug(document)) return {};
  const dict = await getDictionary(locale);
  const copy = dict.legal[document];
  return {
    ...pageMetadata({
      locale,
      path: `/legal/${document}`,
      title: copy.title,
      // The document's own opening, so each one (and each language) has its own.
      description: clip(copy.sections[0]?.body ?? copy.title),
    }),
    // Kept out of search results while the texts are placeholders (the page
    // says so in its draft notice); links from them are still followed. Remove
    // with the notice once the reviewed texts are in. Not in the sitemap either.
    robots: { index: false, follow: true },
  };
}

/**
 * One legal document.
 *
 * Addressable and versioned, because a registration stores which version was
 * accepted — `?v=` is not honoured as a *selector* (there is no archive of old
 * text yet), but the current version is stated on the page so a stored
 * `documentVersion` can be resolved against it.
 *
 * The body is a structural placeholder and says so, visibly. Convincing-looking
 * terms would be the more dangerous output.
 */
export default async function LegalPage({
  params,
}: PageProps<"/[language]/legal/[document]">) {
  const { language: locale, document } = await params;
  if (!isLegalSlug(document)) notFound();

  const dict = await getDictionary(locale);
  const meta = LEGAL[document];
  const copy = dict.legal[document];

  return (
    <PublicShell
      dict={dict}
      locale={isLocale(locale) ? locale : DEFAULT_LOCALE}
    >
      <div className="mx-auto max-w-2xl">
        <BackLink label={dict.common.back} />

        <header className="mb-6 mt-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {copy.title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-subtle">
            {dict.legal.version} {meta.version} · {dict.legal.effectiveFrom}{" "}
            {formatDate(meta.effectiveFrom, locale)}
          </p>
        </header>

        {/* Stated on the page, not only in a code comment: anyone reading this
            in a browser is the person who most needs to know it is not final. */}
        <p className="mb-5 rounded-lg border border-warning-line bg-warning-bg px-3.5 py-3 text-sm text-warning">
          {dict.legal.draftNotice}
        </p>

        <Card>
          <div className="space-y-5">
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-semibold text-ink">{section.heading}</h2>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </Card>

        <nav aria-label={dict.legal.otherDocuments} className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-subtle">
            {dict.legal.otherDocuments}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {LEGAL_DOCUMENTS.filter((d) => d !== document).map((d) => (
              <li key={d}>
                <a
                  href={`/${locale}/legal/${d}`}
                  className="text-brand-700 underline underline-offset-2"
                >
                  {dict.legal[d].title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </PublicShell>
  );
}
