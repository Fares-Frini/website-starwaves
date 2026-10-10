"use client";

import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";

/**
 * Language switch.
 *
 * Swaps the locale segment of the current path so the user stays on the page
 * they were reading rather than being returned to a home screen.
 *
 * The id comes from `useId` because the public pages render this twice — in the
 * header from `sm` up, in the footer below it, so a phone still has it. A
 * hard-coded id made those two duplicates in one document: invalid HTML, and
 * `<label for>` binds to the first match, so the footer's label focused the
 * header's hidden select.
 */
export function LocaleSwitcher({
  current,
  label,
  tone = "light",
}: {
  current: Locale;
  label: string;
  /** `dark` for the night header, footer and menu. */
  tone?: "light" | "dark";
}) {
  const id = useId();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    const segments = pathname.split("/");
    segments[1] = next; // [0] is the empty string before the leading slash
    router.push(segments.join("/") || `/${next}`);
    router.refresh();
  }

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={current}
        onChange={(event) => switchTo(event.target.value)}
        className={
          tone === "dark"
            ? "h-9 rounded-full border border-space-line-strong bg-transparent px-3 text-sm text-starlight-muted transition-colors hover:text-starlight [&>option]:bg-space-900"
            : "rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-sm text-ink-muted"
        }
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
