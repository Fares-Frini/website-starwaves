import { API_BASE } from "./config";

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** The API did not give an answer: down, too slow, or failing. Not "not found". */
export class ApiUnavailableError extends Error {
  constructor(path: string, cause?: unknown) {
    super(`Public API unavailable for ${path}`, { cause });
    this.name = "ApiUnavailableError";
  }
}

/**
 * A page never waits longer than this for the API: past it, the read counts as
 * unavailable and the page says so (or keeps its last good copy) instead of
 * holding a server worker open.
 */
const TIMEOUT_MS = 5000;

/**
 * Anonymous reads of the platform's public API.
 *
 * No token, no cookies: everyone gets the same answer, which is what makes the
 * pages cacheable (60 s in Next's data cache).
 *
 * Two different failures, kept apart on purpose:
 * - the API answers 404 → `null`: the thing does not exist, the page 404s;
 * - the API is down, slow or failing → `ApiUnavailableError`. A page must not
 *   turn an outage into "not found" — search engines drop pages that 404 —
 *   nor into "nothing published". Callers either let it throw (an event page:
 *   its last good copy keeps being served, or the visitor gets a temporary
 *   error) or use `publicTryGet` to show an "unavailable for now" notice.
 */
export async function publicGet<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
  /** Seconds the answer may be reused (Next's data cache). */
  revalidate = 60,
): Promise<T | null> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new ApiUnavailableError(path, error);
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiUnavailableError(path, `HTTP ${response.status}`);
  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new ApiUnavailableError(path, error);
  }
}

/**
 * `publicGet` for sections that must render whatever happens (the home page's
 * events, the catalogue): never throws, and says whether the API was reachable
 * so the page can tell "nothing published" from "unavailable for now".
 */
export async function publicTryGet<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<{ data: T | null; unavailable: boolean }> {
  try {
    return { data: await publicGet<T>(path, query), unavailable: false };
  } catch {
    return { data: null, unavailable: true };
  }
}

export const EMPTY_PAGE = <T,>(): Paginated<T> => ({
  data: [],
  meta: { total: 0, page: 1, limit: 12, pageCount: 0, hasNextPage: false, hasPreviousPage: false },
});
