"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/**
 * A line of words drifting sideways that speeds up with the reader's scroll
 * and turns round when they scroll back up — React Bits' "ScrollVelocity"
 * (reactbits.dev, by David Haz), adapted for this site.
 *
 * What changed from the original, and why:
 * - one line, and the line component lives at module level (the original
 *   declared it inside its parent, so it was recreated on every render);
 * - its frame loop only exists while the band is on screen (not a callback
 *   that wakes up every frame to find nothing to do), and it stands still
 *   under reduced motion;
 * - the copy is measured with a ResizeObserver (fonts loading change it);
 * - the styling is left to the caller.
 *
 * Purely decorative: the caller hides it from assistive technology and says
 * the same thing in real text elsewhere on the page.
 */
export function ScrollVelocity({
  children,
  /** Pixels per second at rest; negative drifts the other way. */
  baseVelocity = 40,
  /** How strongly scroll speed adds to the drift. */
  boost = 4,
  copies = 4,
  className,
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  boost?: number;
  copies?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const reduce = useReducedMotion();
  const width = useCopyWidth(copyRef);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, boost], { clamp: false });
  const x = useTransform(baseX, (v) => (width === 0 ? "0px" : `${wrap(-width, 0, v)}px`));
  const direction = useRef(1);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const delta = Math.min(now - last, 50);
      last = now;
      const factor = velocityFactor.get();
      if (factor < 0) direction.current = -1;
      else if (factor > 0) direction.current = 1;
      let moveBy = direction.current * baseVelocity * (delta / 1000);
      moveBy += direction.current * moveBy * factor;
      baseX.set(baseX.get() + moveBy);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, baseVelocity, baseX, velocityFactor]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={rootRef} className="relative overflow-hidden">
        <m.div className="flex w-max whitespace-nowrap" style={{ x }}>
          {Array.from({ length: copies }, (_, i) => (
            <div key={i} ref={i === 0 ? copyRef : undefined} className={className}>
              {children}
            </div>
          ))}
        </m.div>
      </div>
    </LazyMotion>
  );
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function useCopyWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.offsetWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}
