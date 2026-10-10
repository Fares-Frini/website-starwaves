/**
 * Motion tokens, the same values as the CSS ones in `app/globals.css`
 * (`--dur-*`, `--ease-*`, `--stagger`, `--reveal-distance`), for the few
 * places Motion for React drives an animation.
 */
export const motionTokens = {
  /** Hover and press feedback. */
  fast: 0.15,
  /** Menus and small state changes. */
  base: 0.24,
  /** Section reveals. */
  reveal: 0.7,
  /** Between items revealed together. */
  stagger: 0.07,
  /** How far something travels as it appears, in px. */
  distance: 16,
  /** cubic-bezier(0.16, 1, 0.3, 1) — quick start, long soft landing. */
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  /** cubic-bezier(0.2, 0.7, 0.2, 1) — for movement that is not an arrival. */
  easeStandard: [0.2, 0.7, 0.2, 1] as const,
};
