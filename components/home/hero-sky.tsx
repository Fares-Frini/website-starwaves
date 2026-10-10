"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/*
 * The GPU sky's code (and its WebGL library) is only downloaded when it is
 * actually going to run — never on a phone — and never during the first
 * paint: the hero's words and the CSS sky come first.
 */
const Galaxy = dynamic(() => import("@/components/react-bits/galaxy"), { ssr: false });

/**
 * Whether this device should run the WebGL sky at all. A full-screen shader is
 * the most expensive thing on the page, so it is reserved for desktops with a
 * mouse, enough cores and memory, no data saving and no reduced motion. Every
 * other visitor gets the CSS sky, which is the same night with painted stars.
 */
function canAffordGalaxy(): boolean {
  const matches = (query: string) => window.matchMedia(query).matches;
  if (matches("(prefers-reduced-motion: reduce)")) return false;
  if (!matches("(min-width: 1024px)") || !matches("(hover: hover) and (pointer: fine)")) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  return true;
}

/**
 * The hero's star field. The CSS sky (`.starfield`) is always there — it is
 * all that phones, reduced motion and modest machines ever show, and what
 * everybody sees first. On a capable desktop, once the page has settled (idle
 * time, so it never competes with the page becoming interactive), React Bits'
 * Galaxy fades in on top; the painted stars then step back so the two never
 * read as one busy layer.
 *
 * Tuned for the brand: a sparse field (density), stars tinted towards the
 * blue–violet of the logo (hue, saturation), a slow turn, a soft twinkle, and
 * a drift towards the pointer rather than stars fleeing it.
 */
export function HeroSky() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const starsRef = useRef<HTMLDivElement>(null);

  // The sky's endless effects (twinkle, drift, the pulse on the wave) pause
  // while the hero is off screen: `data-offscreen` on the sky, read by CSS.
  useEffect(() => {
    const sky = starsRef.current?.parentElement;
    if (!sky) return;
    const observer = new IntersectionObserver(([entry]) => {
      sky.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    observer.observe(sky);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canAffordGalaxy()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => setLoad(true);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(start, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        ref={starsRef}
        className="starfield starfield-twinkle transition-opacity duration-1000"
        style={{ opacity: ready ? 0.25 : undefined }}
      />
      {load ? (
        <Galaxy
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
          focal={[0.72, 0.42]}
          density={0.9}
          hueShift={220}
          saturation={0.55}
          glowIntensity={0.3}
          twinkleIntensity={0.45}
          starSpeed={0.25}
          speed={0.6}
          rotationSpeed={0.015}
          onReady={() => setReady(true)}
        />
      ) : null}
      {/* A soft veil behind the words, so no bright star sits on the text. */}
      <div className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-space-950/70 via-space-950/35 to-transparent lg:w-3/5 rtl:bg-gradient-to-l" />
    </>
  );
}
