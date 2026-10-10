"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { isGroup, type NavEntry } from "./nav-model";

/**
 * The menu below `lg`: a full-screen sheet over the night sky.
 *
 * A Radix Dialog (shadcn's Sheet is the same primitive): focus moves into it
 * and is trapped while it is open, Escape and the close button dismiss it,
 * and the page behind cannot be scrolled or reached. Every link closes it,
 * since a client-side navigation would otherwise leave it open on the new
 * page.
 */
export function MobileNav({
  entries,
  labels,
  primary,
  secondary,
  footer,
}: {
  entries: NavEntry[];
  labels: { open: string; close: string; title: string };
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  /** Rendered at the bottom of the sheet — the language switch. */
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="inline-flex size-10 items-center justify-center rounded-full border border-space-line-strong text-starlight transition-colors hover:bg-white/5 lg:hidden"
        aria-label={labels.open}
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content className="theme-space fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-s border-space-line bg-space-950 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-left">
          <div aria-hidden className="starfield opacity-40" />
          <div className="relative flex items-center justify-between px-6 pt-5">
            <Dialog.Title className="font-display text-sm font-medium tracking-wide text-starlight-subtle">
              {labels.title}
            </Dialog.Title>
            <Dialog.Close
              className="inline-flex size-10 items-center justify-center rounded-full border border-space-line-strong text-starlight transition-colors hover:bg-white/5"
              aria-label={labels.close}
            >
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{labels.title}</Dialog.Description>

          <nav className="relative flex-1 px-6 py-8">
            <ul className="space-y-6">
              {entries.map((entry) =>
                isGroup(entry) ? (
                  <li key={entry.label}>
                    <p className="text-xs font-medium text-starlight-subtle">{entry.label}</p>
                    <ul className="mt-2 space-y-1 border-s border-space-line ps-4">
                      {entry.links.map((link) => (
                        <li key={link.href}>
                          <Dialog.Close asChild>
                            <Link
                              href={link.href}
                              aria-current={isActive(link.href) ? "page" : undefined}
                              className={cn(
                                "block py-1.5 text-base transition-colors",
                                isActive(link.href) ? "text-starlight" : "text-starlight-muted hover:text-starlight",
                              )}
                            >
                              {link.label}
                            </Link>
                          </Dialog.Close>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={entry.href}>
                    <Dialog.Close asChild>
                      <Link
                        href={entry.href}
                        aria-current={isActive(entry.href) ? "page" : undefined}
                        className={cn(
                          "font-display text-2xl tracking-tight transition-colors",
                          isActive(entry.href) ? "text-starlight" : "text-starlight-muted hover:text-starlight",
                        )}
                      >
                        {entry.label}
                      </Link>
                    </Dialog.Close>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="relative space-y-3 border-t border-space-line px-6 py-6">
            <Dialog.Close asChild>
              <Link href={primary.href} className={cn(buttonVariants({ variant: "nova", size: "lg" }), "w-full")}>
                {primary.label}
              </Link>
            </Dialog.Close>
            <a href={secondary.href} className={cn(buttonVariants({ variant: "orbit", size: "lg" }), "w-full")}>
              {secondary.label}
            </a>
            {footer ? <div className="flex justify-center pt-2">{footer}</div> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
