"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Shared state for a list screen's controls.
 *
 * List state lives in the URL — a filtered view is then linkable, survives a
 * reload and works with the back button, and the page itself can stay a Server
 * Component that simply reads `searchParams`.
 *
 * The one thing the URL cannot carry is *"a change is in flight"*. Without it,
 * changing a filter looks like nothing happened until the server responds, so
 * the transition is shared here and the results dim while it runs.
 */

interface ListState {
  params: URLSearchParams;
  pending: boolean;
  update: (changes: Record<string, string | null>, keepPage?: boolean) => void;
}

const Ctx = createContext<ListState | null>(null);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (changes: Record<string, string | null>, keepPage = false) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      // Any change but paging returns to page 1: staying on page 7 of a result
      // set that just shrank to two pages lands on an empty screen that looks
      // like a bug.
      if (!keepPage) next.delete("page");

      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [params, pathname, router],
  );

  const value = useMemo(
    () => ({ params, pending, update }),
    [params, pending, update],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useList(): ListState {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("List controls must be used inside <ListProvider>.");
  }
  return ctx;
}

/**
 * Dims and disables the results while a filter change is in flight.
 *
 * `aria-busy` carries the same fact to assistive tech, which cannot see the
 * opacity change.
 */
export function ListBody({ children }: { children: React.ReactNode }) {
  const { pending } = useList();
  return (
    <div
      aria-busy={pending || undefined}
      className={
        pending
          ? "pointer-events-none opacity-55 transition-opacity duration-150"
          : "transition-opacity duration-150"
      }
    >
      {children}
    </div>
  );
}
