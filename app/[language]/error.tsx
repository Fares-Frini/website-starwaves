"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui";
import frDict from "@/lib/i18n/dictionaries/fr";

/**
 * The 500 boundary.
 *
 * A Client Component by requirement, so it cannot await the dictionary the way
 * a page does. It uses the French one directly — French is the primary locale
 * and the reference dictionary, and a hardcoded English string here would be
 * the wrong half of the audience.
 *
 * `digest` is Next's hash of the server-side error and is the only handle
 * support has on a production stack trace, so it is shown rather than swallowed
 * — the same job `requestId` does for API failures.
 *
 * `reset()` retries the render, which is the right first move for a transient
 * failure; the links exist for when it is not transient.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = frDict;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        {dict.errors.title}
      </h1>
      <p className="mt-2 text-ink-muted">{dict.errors.generic}</p>

      {error.digest ? (
        <p className="mt-4 text-xs text-ink-subtle">
          {dict.errors.requestId}:{" "}
          <span className="tabular font-medium text-ink-muted">
            {error.digest}
          </span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className={buttonClass("primary", "md")}
        >
          {dict.common.retry}
        </button>
        <Link href="/" className={buttonClass("secondary", "md")}>
          {dict.errors.backHome}
        </Link>
      </div>
    </main>
  );
}
