import { Fragment } from "react";
import { ScrollVelocity } from "@/components/react-bits/scroll-velocity";
import type { Dictionary } from "@/lib/i18n";

/**
 * The seam between the hero and the trades: the formats Starwaves runs,
 * drifting past in outlined capitals and picking up speed with the scroll —
 * the "wave" of the name, set in motion by the reader. Each word is separated
 * by a small four-pointed star in the brand's colours.
 *
 * Decorative and hidden from assistive technology: the same formats are
 * named in real text just below (the trades) and on the events page.
 */
export function FormatsBand({ dict }: { dict: Dictionary }) {
  const stars = ["#5aa2f5", "#a79cf0", "#f07aae", "#fcb65a"];

  return (
    <div aria-hidden className="theme-space relative bg-space-950 py-6 sm:py-8">
      {/* The trades' faint sky continues behind the words, so the band is not a strip. */}
      <div className="starfield opacity-35" />
      <ScrollVelocity
        baseVelocity={-28}
        className="flex shrink-0 items-center font-display text-[clamp(2rem,1.2rem+3.2vw,4.25rem)] font-medium uppercase leading-none tracking-tight"
      >
        {dict.site.band.map((word, index) => (
          <Fragment key={word}>
            <span className="band-outline px-[0.35em]">{word}</span>
            <svg
              width="0.42em"
              height="0.42em"
              viewBox="0 0 24 24"
              className="shrink-0"
              fill={stars[index % stars.length]}
            >
              <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
            </svg>
          </Fragment>
        ))}
      </ScrollVelocity>
      {/* The edges fade into the night, so the words arrive and leave softly. */}
      <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-space-950 to-transparent sm:w-32 rtl:bg-gradient-to-l" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-space-950 to-transparent sm:w-32 rtl:bg-gradient-to-r" />
    </div>
  );
}
