"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

/**
 * Reveals its content the first time it scrolls into view: a short rise and
 * fade, timed by the motion tokens in `globals.css` (`[data-reveal]`).
 *
 * Nothing is hidden unless this script has run *and* the block starts below
 * the screen: on mount it arms itself (`data-armed`) only if it is not yet
 * visible, so a page without JavaScript shows everything and what is already
 * on screen never flickers. Reduced motion shows it all at once. `index`
 * staggers siblings revealed together.
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: "div" | "li" | "section" | "header";
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // An attribute on the element, not React state: arming is a one-off
    // decision about where the block starts, not something to re-render for.
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.setAttribute("data-armed", "");
    }
  }, []);

  return (
    <Tag
      // The ref's element type follows `as`; all four are plain HTMLElements.
      ref={ref as React.Ref<never>}
      data-reveal=""
      data-revealed={inView ? "" : undefined}
      style={{ "--reveal-index": index } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
