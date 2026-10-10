"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Depth for the first screen: as the page scrolls away from the top, the
 * wrapped block drifts by `distance` pixels (over the first `range` pixels of
 * scroll) and, with `fade`, dims — so the star sinks behind the words and the
 * words step back before the next section takes over.
 *
 * Only for blocks at the top of the page: it reads the page's scroll, not the
 * block's position. It follows the scroll, it never moves it; under reduced
 * motion it does nothing.
 */
export function ScrollDrift({
  distance,
  range = 700,
  fade = false,
  className,
  children,
}: {
  /** Pixels moved over `range`; positive moves down (slower than the page). */
  distance: number;
  range?: number;
  fade?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, range], [0, distance], { clamp: true });
  const opacity = useTransform(scrollY, [0, range], [1, fade ? 0.15 : 1], { clamp: true });

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className={className} style={reduce ? undefined : { y, opacity }}>
        {children}
      </m.div>
    </LazyMotion>
  );
}
