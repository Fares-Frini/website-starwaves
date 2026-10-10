/**
 * The documents consent is recorded against.
 *
 * `ConsentRecord` stores the **version of the text that was actually shown**, so
 * these versions and the consent step have to move together. This module is the
 * single source of truth for both: `lib/registration/load.ts` derives the
 * consent list from it rather than repeating the numbers, because a document
 * bumped in one place and not the other would record agreement to text nobody
 * saw.
 *
 * Each document is addressable at `/[locale]/legal/[slug]` and states its
 * version on the page, so a stored `documentVersion` can always be resolved
 * back to what it referred to.
 *
 * **The bodies below are structural placeholders, not legal text.** They lay out
 * the sections a Tunisian events platform needs and say plainly, on the page,
 * that they await review. Writing convincing-looking terms would be worse than
 * writing none: someone would ship them.
 */

export const LEGAL_DOCUMENTS = ["terms", "privacy", "cookies"] as const;
export type LegalSlug = (typeof LEGAL_DOCUMENTS)[number];

export interface LegalDocument {
  slug: LegalSlug;
  /** Bump when the text changes. Consent records point at this string. */
  version: string;
  /** ISO date the version took effect. */
  effectiveFrom: string;
}

export const LEGAL: Record<LegalSlug, LegalDocument> = {
  terms: { slug: "terms", version: "1.0", effectiveFrom: "2026-01-01" },
  privacy: { slug: "privacy", version: "1.0", effectiveFrom: "2026-01-01" },
  cookies: { slug: "cookies", version: "1.0", effectiveFrom: "2026-01-01" },
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_DOCUMENTS as readonly string[]).includes(value);
}
