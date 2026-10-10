"use client";

import { cx } from "./index";
import { useList } from "./list-context";

/**
 * Search, filters and pagination for the list screens.
 *
 * All of them read and write the same URL through `useList`, so they share one
 * transition — which is what lets the results dim as a set rather than each
 * control spinning on its own.
 */

export function SearchBox({
  placeholder,
  label,
  tone = "light",
}: {
  placeholder: string;
  label: string;
  /** `dark` on the night page headers. */
  tone?: "light" | "dark";
}) {
  const { update, params, pending } = useList();
  const initial = params.get("search") ?? "";

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("list-search");
        update({
          search:
            input instanceof HTMLInputElement ? input.value.trim() || null : null,
        });
      }}
      className={tone === "dark" ? "relative min-w-0 flex-1 sm:max-w-md" : "relative min-w-0 flex-1 sm:max-w-xs"}
    >
      <label htmlFor="list-search" className="sr-only">
        {label}
      </label>
      <span
        aria-hidden
        className={
          tone === "dark"
            ? "pointer-events-none absolute inset-y-0 start-4 grid place-items-center text-starlight-subtle"
            : "pointer-events-none absolute inset-y-0 start-3 grid place-items-center text-ink-faint"
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        key={`list-search-${params.toString()}`}
        id="list-search"
        type="search"
        defaultValue={initial}
        placeholder={placeholder}
        disabled={pending}
        className={
          tone === "dark"
            ? "h-12 w-full rounded-full border border-space-line-strong bg-white/[0.04] ps-11 pe-4 text-base text-starlight placeholder:text-starlight-subtle transition-colors focus:border-nova-blue/70 disabled:opacity-60"
            : "h-9 w-full rounded-lg border border-line-strong bg-surface ps-9 pe-3 text-sm text-ink placeholder:text-ink-faint disabled:opacity-60"
        }
      />
    </form>
  );
}

export function FilterSelect({
  name,
  label,
  allLabel,
  options,
}: {
  name: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  const { update, params, pending } = useList();
  const current = params.get(name) ?? "";

  return (
    <div className="shrink-0">
      <label htmlFor={`filter-${name}`} className="sr-only">
        {label}
      </label>
      <select
        id={`filter-${name}`}
        value={current}
        disabled={pending}
        onChange={(e) => update({ [name]: e.target.value || null })}
        className={cx(
          "h-9 rounded-lg border bg-surface px-2.5 text-sm disabled:opacity-60",
          current
            ? "border-brand-300 font-medium text-brand-700"
            : "border-line-strong text-ink-muted",
        )}
      >
        <option value="">
          {label}: {allLabel}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * One choice among a few, as a row of pills — the event types on the dark
 * catalogue header. Writes the same URL parameter a select would;
 * `aria-pressed` says which pill is on.
 */
export function ChipFilter({
  name,
  label,
  allLabel,
  options,
}: {
  name: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  const { update, params, pending } = useList();
  const current = params.get(name) ?? "";
  const chips = [{ value: "", label: allLabel }, ...options];

  return (
    <div role="group" aria-label={label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => {
        const on = chip.value === current;
        return (
          <button
            key={chip.value || "all"}
            type="button"
            aria-pressed={on}
            disabled={pending}
            onClick={() => update({ [name]: chip.value || null })}
            className={cx(
              "h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm transition-colors duration-[var(--dur-fast)] disabled:opacity-60",
              on
                ? "border-starlight bg-starlight font-medium text-space-950"
                : "border-space-line-strong text-starlight-muted hover:border-nova-violet/60 hover:text-starlight",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

export function ResetFilters({ label, active }: { label: string; active: boolean }) {
  const { update, params, pending } = useList();
  if (!active) return null;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const cleared: Record<string, null> = {};
        for (const key of params.keys()) cleared[key] = null;
        update(cleared);
      }}
      className="h-9 shrink-0 rounded-lg px-2.5 text-sm text-ink-muted underline underline-offset-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  hasNext,
  hasPrevious,
  labels,
}: {
  page: number;
  pageCount: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  labels: {
    previous: string;
    next: string;
    page: string;
    of: string;
    results: string;
  };
}) {
  const { update, pending } = useList();
  if (total === 0) return null;

  const go = (n: number) => update({ page: String(n) }, true);

  return (
    <nav
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
      aria-label={labels.page}
    >
      <p className="tabular text-sm text-ink-subtle">
        {total.toLocaleString()} {labels.results}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={!hasPrevious || pending}
          className="h-9 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {labels.previous}
        </button>
        <span className="tabular px-1 text-sm text-ink-muted">
          {labels.page} {page} {labels.of} {Math.max(pageCount, 1)}
        </span>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={!hasNext || pending}
          className="h-9 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {labels.next}
        </button>
      </div>
    </nav>
  );
}

/** The bar above a list: search on the left, filters after it. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>;
}
