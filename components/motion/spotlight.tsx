"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A panel lit from where the pointer is: a soft glow follows the cursor across
 * it, like a torch over a star chart. In the spirit of React Bits' "Spotlight
 * Card", written here in a few lines rather than copied.
 *
 * The glow is a CSS radial gradient positioned by two custom properties, set
 * on pointer move — no re-render, no animation loop. Touch screens and
 * keyboard users simply see the panel without it; nothing depends on it.
 */
export function Spotlight({
  className,
  color = "rgb(90 162 245 / 0.14)",
  children,
}: {
  className?: string;
  /** The glow's colour, as any CSS colour. */
  color?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(event) => {
        const element = ref.current;
        if (!element || event.pointerType !== "mouse") return;
        const box = element.getBoundingClientRect();
        element.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
        element.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
      }}
      className={cn("group/spot relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-[var(--dur-base)] group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}
