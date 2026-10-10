/* eslint-disable @next/next/no-img-element */

/**
 * The Starwaves lockups and mark.
 *
 * These render as `<img>`, and that is a correctness decision rather than a
 * convenience one. The supplied colour SVGs each define gradients under the
 * same ids (`linear-gradient`, `radial-gradient`, …) and carry a `<style>`
 * block using `.cls-1`, `.cls-2`, …. Inlined into HTML, ids resolve
 * document-wide and that `<style>` is document-scoped CSS — so a second inlined
 * lockup repaints the first, and `.cls-2 { fill: #fff }` from the white variant
 * would repaint anything else on the page carrying that class. An `<img>`
 * isolates the whole document completely.
 *
 * (The copies in `public/brand` are additionally id-prefixed per file, so
 * inlining would be survivable — but `<img>` is still the default.)
 *
 * Two further constraints, both from the files themselves:
 *
 *   • Every lockup is `viewBox="0 0 1192.59 242.2"` — 4.92:1. Callers set a
 *     height; the width is *computed* from that one ratio constant and set
 *     explicitly. It used to be left as `width: auto`, which is how the mark
 *     came to render 30px tall and **0px wide** in the mobile header: these
 *     files carry a `viewBox` but no `width`/`height` attributes, so with
 *     Preflight's `img { max-width: 100% }` the auto width had nothing to
 *     resolve against and collapsed. Computing both from the ratio cannot
 *     stretch anything and cannot collapse.
 *   • The colour variants cannot be recoloured: their fills are gradient
 *     references, and CSS `fill` does not reach them. For a single-colour
 *     context use `variant="black"` or `"white"`, never a filter over colour.
 */

const LOCKUP_RATIO = 1192.59 / 242.2; // 4.923…
const MARK_RATIO = 263 / 242.2; // 1.086…

type LockupVariant = "color" | "color-white" | "black" | "white";
type Lockup = "sw-ec" | "starwaves" | "sw-prod";

const LOCKUP_FILES: Record<Lockup, Record<LockupVariant, string | null>> = {
  // The platform's primary lockup: this product is the events business.
  "sw-ec": {
    color: "/brand/sw-ec-color.svg",
    "color-white": "/brand/sw-ec-color-white.svg",
    black: "/brand/sw-ec-black.svg",
    white: "/brand/sw-ec-white.svg",
  },
  // The parent brand, for where space is tight.
  starwaves: {
    color: "/brand/starwaves-color.svg",
    "color-white": null, // no descriptor line, so no light/dark descriptor split
    black: "/brand/starwaves-black.svg",
    white: "/brand/starwaves-white.svg",
  },
  // The sister business. Not used in this product unless explicitly asked for.
  "sw-prod": {
    color: "/brand/sw-prod-color.svg",
    "color-white": "/brand/sw-prod-color-white.svg",
    black: "/brand/sw-prod-black.svg",
    white: "/brand/sw-prod-white.svg",
  },
};

export interface LogoProps {
  lockup?: Lockup;
  /**
   * `color` sets the descriptor in black (for light backgrounds);
   * `color-white` sets it in white (for dark ones). The plain `white` variant
   * is invisible on white — that is the file working as intended.
   */
  variant?: LockupVariant;
  /** Rendered height in px. Width follows the 4.92:1 ratio and is never set. */
  height?: number;
  className?: string;
  /** Empty when the logo sits beside the wordmark as text, i.e. is decorative. */
  alt?: string;
  priority?: boolean;
}

export function Logo({
  lockup = "sw-ec",
  variant = "color",
  height = 40,
  className,
  alt = "Starwaves Events & Congresses",
  priority = false,
}: LogoProps) {
  const src = LOCKUP_FILES[lockup][variant] ?? LOCKUP_FILES[lockup].color!;
  const width = Math.round(height * LOCKUP_RATIO);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ height, width, maxWidth: "none" }}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export interface MarkProps {
  /** `mono` inherits `currentColor`; `color` carries the brand gradient. */
  variant?: "color" | "mono" | "black" | "white";
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * The star-and-wave alone, extracted from the primary lockup as real paths
 * rather than a scaled-down lockup with unreadable words. Near square at
 * 1.09:1 — this is the favicon, app icon and avatar shape.
 */
export function Mark({
  variant = "color",
  size = 32,
  className,
  alt = "Starwaves",
}: MarkProps) {
  const width = Math.round(size * MARK_RATIO);
  return (
    <img
      src={`/brand/mark-${variant}.svg`}
      alt={alt}
      width={width}
      height={size}
      className={className}
      style={{ height: size, width, maxWidth: "none" }}
      decoding="async"
    />
  );
}
