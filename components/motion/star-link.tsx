"use client";

import Link from "next/link";
import StarBorder from "@/components/react-bits/star-border";

/**
 * The site's main action with a star orbiting its edge: React Bits'
 * StarBorder rendered as a link: a deep-night pill whose edge is a faint
 * violet track for the star to run on. (On a white pill the trail vanished
 * into the fill.) A client component of its own because the link component
 * cannot be handed to StarBorder from a Server Component.
 *
 * Use it once per page at most — it is meant to be the one moving object
 * around an action.
 */
export function StarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <StarBorder
      as={Link}
      href={href}
      radius={999}
      thickness={1.5}
      color="#f2f5ff"
      trailColor="#a79cf0"
      duration={4.5}
      glow={0.9}
      sparkle
      backgroundColor="linear-gradient(180deg, #1d2750, #111833)"
      textColor="var(--color-starlight)"
      borderColor="rgb(167 156 240 / 0.35)"
      className="h-12 whitespace-nowrap px-7 py-0 text-base transition-shadow duration-[var(--dur-fast)] hover:shadow-glow-blue"
    >
      {children}
    </StarBorder>
  );
}
