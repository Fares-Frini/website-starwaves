"use client";

import { useEffect, useRef } from "react";
import { stagger, useAnimate, useInView } from "motion/react";

/**
 * A heading whose words come into focus one after the other as it scrolls
 * into view — like stars resolving through a telescope. React Bits'
 * "BlurText" (reactbits.dev, by David Haz), adapted for this site.
 *
 * What changed from the original, and why:
 * - it renders a real heading (`as`), whose accessible name is the plain
 *   sentence (screen readers never hear it word by word);
 * - the words are in the HTML at full opacity. They are only hidden on mount,
 *   and only if the heading starts below the screen — the rule `Reveal`
 *   follows — so without JavaScript, or for a heading already in view, nothing
 *   is ever invisible and nothing flickers;
 * - words wrap like normal text (spaces, not a flex row), so centred and long
 *   headings break where they should;
 * - a shorter rise, from below, and no animation at all under reduced motion.
 */
export function BlurHeading({
  text,
  as: Tag = "h2",
  className,
  /** Seconds between two words. */
  step = 0.07,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  step?: number;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const inView = useInView(scope, { once: true, margin: "0px 0px -12% 0px" });
  const armed = useRef(false);
  const words = text.split(" ");

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top <= window.innerHeight) return;
    armed.current = true;
    animate("[data-word]", { opacity: 0, filter: "blur(10px)", y: 22 }, { duration: 0 });
  }, [animate, scope]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    animate(
      "[data-word]",
      {
        opacity: [0, 0.5, 1],
        filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
        y: [22, -3, 0],
      },
      { duration: 0.7, times: [0, 0.5, 1], ease: "easeOut", delay: stagger(step) },
    );
  }, [inView, animate, step]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={scope} aria-hidden>
        {words.map((word, index) => (
          <span key={index}>
            <span data-word className="inline-block">
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
