/**
 * Where the two other pieces live.
 *
 * The showcase site owns neither data nor accounts: events come from the
 * platform's public API, and every sign-in or registration is a link to the
 * platform. Both addresses are configuration, never hard-coded, so the same
 * build serves development, staging and production.
 */
export const API_ORIGIN = (
  process.env.API_ORIGIN ?? "http://localhost:3000"
).replace(/\/$/, "");

export const API_BASE = `${API_ORIGIN}/api/v1`;

/** The platform (the application people sign in to). */
export const PLATFORM_URL = (
  process.env.NEXT_PUBLIC_PLATFORM_URL ??
  process.env.PLATFORM_URL ??
  "http://localhost:3100"
).replace(/\/$/, "");

/**
 * This site's own public address, for absolute URLs: canonical links, social
 * previews and structured data. Configuration like the two above.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200"
).replace(/\/$/, "");
