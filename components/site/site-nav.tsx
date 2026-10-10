"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { isGroup, type NavEntry, type NavGroup } from "./nav-model";

/**
 * The header's navigation, from `lg` up (below, `MobileNav` takes over).
 *
 * Radix NavigationMenu, as shadcn uses it: keyboard and screen-reader
 * behaviour come with it (arrow keys between items, Escape closes, the
 * dropdowns are announced as such). Groups open a dark panel with each page's
 * one-line description; plain entries are links.
 *
 * The thin line of light under the current section draws itself from its
 * centre when the section changes (`.nav-line` in `globals.css`) — the only
 * motion in the header, in CSS. It used to slide between items with Motion's
 * layout animations, which loaded the whole library (~45 KB) on every page,
 * phones included, where this menu is not even shown.
 */
export function SiteNav({ entries, label }: { entries: NavEntry[]; label: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const groupActive = (group: NavGroup) => group.links.some((link) => isActive(link.href));

  return (
    <NavigationMenu.Root
      aria-label={label}
      delayDuration={60}
      className="relative hidden lg:block"
    >
      <NavigationMenu.List className="flex items-center gap-0.5">
        {entries.map((entry) =>
          isGroup(entry) ? (
            <NavigationMenu.Item key={entry.label}>
              <NavigationMenu.Trigger className={cn(itemClass(groupActive(entry)), HOVER_BRIDGE)}>
                {entry.label}
                <svg
                  aria-hidden
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  className="text-starlight-subtle transition-transform duration-[var(--dur-base)] group-data-[state=open]:rotate-180"
                >
                  <path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {groupActive(entry) ? <ActiveLine /> : null}
              </NavigationMenu.Trigger>
              {/* Positioned out of flow (as in shadcn's menu): Radix sizes the panel
                    from this element, so it must keep its own width instead of
                    stretching to the panel's — otherwise a narrow menu opened
                    after a wide one stays wide. */}
                <NavigationMenu.Content className="absolute start-0 top-0 w-auto data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out">
                <ul
                  className={cn(
                    "grid gap-1 p-2",
                    entry.links.length > 2 ? "w-[36rem] grid-cols-2" : "w-[22rem]",
                  )}
                >
                  {entry.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenu.Link asChild active={isActive(link.href)}>
                        <Link
                          href={link.href}
                          className="group/link block rounded-xl p-3 transition-colors duration-[var(--dur-fast)] hover:bg-white/[0.04] data-[active]:bg-white/[0.06]"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-starlight">
                            <span
                              aria-hidden
                              className="size-1.5 rounded-full bg-starlight-faint transition-colors group-hover/link:bg-nova-blue group-data-[active]/link:bg-nova-pink"
                            />
                            {link.label}
                          </span>
                          {link.hint ? (
                            <span className="mt-1 block ps-3.5 text-xs leading-relaxed text-starlight-subtle">
                              {link.hint}
                            </span>
                          ) : null}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={entry.href}>
              <NavigationMenu.Link asChild active={isActive(entry.href)}>
                <Link href={entry.href} className={itemClass(isActive(entry.href))}>
                  {entry.label}
                  {isActive(entry.href) ? <ActiveLine /> : null}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      {/* Transparent to the pointer: this full-width strip starts right under
          the buttons and used to cover their hover bridge. Only the panel
          itself takes the pointer.
          The panel's edge is a ring (a shadow), not a border: Radix sizes the
          panel from its content, and a 1 px border made the content 2 px
          narrower than the panel each time — so the panel kept re-measuring
          and shrank, step after step, under the cursor.
          `shrink-0`: the strip is only as wide as the menu bar, and the panel
          used to be squeezed to it, cutting off the right-hand column. */}
      <div className="pointer-events-none absolute start-0 top-full flex w-full justify-center">
        <NavigationMenu.Viewport className="pointer-events-auto relative mt-3 shrink-0 h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top overflow-hidden rounded-panel bg-space-900 shadow-panel ring-1 ring-space-line transition-[width,height] duration-[var(--dur-base)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95" />
      </div>
    </NavigationMenu.Root>
  );
}

/*
 * An invisible strip under each menu button, down to the panel. The panel
 * opens 12 px below the button; without the strip, a pointer pausing in that
 * gap had left the button without reaching the panel, so Radix started
 * closing the menu — the panel shrank away (its exit animation) under the
 * visitor's cursor. Being part of the button, the strip keeps it hovered.
 */
const HOVER_BRIDGE = "after:absolute after:inset-x-0 after:top-full after:h-5 after:content-['']";

function itemClass(active: boolean) {
  return cn(
    "group relative inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm transition-colors duration-[var(--dur-fast)] outline-none",
    active ? "text-starlight" : "text-starlight-muted hover:text-starlight",
    "data-[state=open]:text-starlight hover:bg-white/[0.04] data-[state=open]:bg-white/[0.06]",
  );
}

/** The line of light under the current section. */
function ActiveLine() {
  return (
    <span
      aria-hidden
      className="nav-line absolute inset-x-3 -bottom-[13px] h-px"
      style={{ background: "var(--gradient-brand)" }}
    />
  );
}
