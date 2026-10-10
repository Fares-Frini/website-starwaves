"use client";

import { useEffect, useRef } from "react";
import { LazyMotion, domAnimation, m, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * The timeline's line of light, filling as the reader scrolls through the
 * steps. It follows the scroll, it never moves it. Each step's number lights
 * up as the light reaches it (`data-lit` on the step; the look is in
 * `globals.css`) and dims again if the reader goes back up. Under reduced
 * motion the line is simply full; the numbers still light, without movement.
 */
export function JourneyRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const steps = ref.current?.querySelectorAll("li");
    if (!steps?.length) return;
    // The line's head sits about 55% down the screen (the rail's offset):
    // a step is lit once its top has passed that line, and stays lit above it.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const lit = entry.isIntersecting || entry.boundingClientRect.top < 0;
          entry.target.toggleAttribute("data-lit", lit);
        }
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} className="relative">
        <div aria-hidden className="absolute inset-y-2 start-[19px] w-px bg-space-line" />
        <m.div
          aria-hidden
          className="absolute inset-y-2 start-[19px] w-px origin-top"
          style={{
            background: "linear-gradient(180deg, #5aa2f5, #a79cf0 40%, #f07aae 75%, #fcb65a)",
            scaleY: reduce ? 1 : progress,
          }}
        />
        {children}
      </div>
    </LazyMotion>
  );
}
