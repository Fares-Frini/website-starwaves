"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

/**
 * The "go back" control.
 *
 * Prefers an explicit parent `href`, because that is *deterministic*: the same
 * page always goes to the same place, and it works on a fresh tab, a shared
 * link or a bookmark — none of which have history to go back through.
 *
 * `router.back()` is the fallback, and only when there is history to return to.
 * A back button that silently does nothing, or that walks the visitor out of
 * the app to wherever they came from, is worse than no button.
 */
export function BackLink({
  href,
  label,
  fallbackLabel,
}: {
  /** The parent page. Omit only where there genuinely is no parent. */
  href?: string;
  label: string;
  /** Used when falling back to browser history. */
  fallbackLabel?: string;
}) {
  const router = useRouter();
  const canGoBack = useHistoryDepth();

  const className =
    "inline-flex items-center gap-1.5 text-sm text-ink-subtle transition-colors hover:text-ink";

  const arrow = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      // Flips with the writing direction, ready for Arabic.
      className="rtl:rotate-180"
    >
      <path d="M12.5 4.5 7 10l5.5 5.5" />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {arrow}
        {label}
      </Link>
    );
  }

  if (!canGoBack) return null;

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      {arrow}
      {fallbackLabel ?? label}
    </button>
  );
}

/**
 * Whether this tab has somewhere to go back to.
 *
 * `history.length > 1` is the only signal available, and it is imperfect — but
 * it correctly identifies the case that matters: a page opened directly, where
 * "back" would leave the site.
 */
function useHistoryDepth(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => window.history.length > 1,
    () => false,
  );
}
