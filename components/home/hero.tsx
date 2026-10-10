import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ScrollDrift } from "@/components/motion/scroll-drift";
import { HeroSky } from "./hero-sky";
import type { Dictionary } from "@/lib/i18n";

/**
 * The first screen: the night sky, the brand's wave of light drawn across it,
 * the Starwaves star glowing where the wave rises, and the promise.
 *
 * Server-rendered first: the sky is CSS, the wave is an inline SVG and the
 * entrance is CSS keyframes (`.enter`, `.glow-in`, `.wave-draw` in
 * `globals.css`), so the words and buttons are in the HTML from the first
 * byte and appear even if JavaScript never runs. Once the page is
 * interactive, two things join in: a living star field (`HeroSky`) and, on
 * scroll, a little depth — the star sinks slower than the page and the words
 * step back (`ScrollDrift`). Under reduced motion it all simply stands still.
 *
 * The sequence: the sky and its glows, the wave drawing itself, the star
 * lighting up, then the two lines of the headline, the lead, the actions and
 * the three trades — about a second end to end.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: string }) {
  const m = dict.marketing;
  const trades = [
    { href: `/${locale}/solutions/congresses`, label: m.congresses.title },
    { href: `/${locale}/solutions/corporate`, label: m.corporate.title },
    { href: `/${locale}/solutions/productions`, label: m.productions.title },
  ];

  return (
    <section className="theme-space relative isolate overflow-hidden bg-space-950">
      {/* The sky */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <HeroSky />
        <div
          className="nebula -top-40 end-[-10%] size-[46rem] animate-drift"
          style={{ background: "radial-gradient(closest-side, rgb(46 134 239 / 0.42), transparent)" }}
        />
        <div
          className="nebula top-1/3 -start-48 size-[38rem] animate-drift-slow"
          style={{ background: "radial-gradient(closest-side, rgb(129 122 224 / 0.38), transparent)" }}
        />
        <div
          className="nebula -bottom-56 end-1/4 size-[40rem] animate-drift"
          style={{ background: "radial-gradient(closest-side, rgb(239 72 141 / 0.3), transparent)" }}
        />
        <Wave />
        {/* The night closes in at the bottom, so the next section starts clean. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-space-950" />
      </div>

      <div className="container-site relative grid min-h-[min(92svh,52rem)] items-center gap-10 pb-28 pt-16 lg:grid-cols-[1.55fr_1fr] lg:pt-12">
        <ScrollDrift distance={-40} fade className="max-w-[52rem]">
          <h1 className="font-display text-display font-medium text-starlight">
            <span className="enter block" style={{ "--enter": 1 } as React.CSSProperties}>
              {dict.site.hero.line1}
            </span>
            <span
              className="enter mt-2 block bg-clip-text text-transparent"
              style={
                {
                  "--enter": 2,
                  backgroundImage:
                    "linear-gradient(100deg, #5aa2f5 0%, #a79cf0 38%, #f07aae 70%, #fcb65a 100%)",
                } as React.CSSProperties
              }
            >
              {dict.site.hero.line2}
            </span>
          </h1>

          <p
            className="enter mt-7 max-w-xl text-lead text-starlight-muted"
            style={{ "--enter": 3 } as React.CSSProperties}
          >
            {dict.site.hero.lead}
          </p>

          <div
            className="enter mt-9 flex flex-wrap items-center gap-3"
            style={{ "--enter": 4 } as React.CSSProperties}
          >
            <Button asChild variant="nova" size="lg">
              <Link href={`/${locale}/contact`}>{dict.site.nav.organise}</Link>
            </Button>
            <Button asChild variant="orbit" size="lg">
              <Link href={`/${locale}/events`}>{dict.home.heroBrowse}</Link>
            </Button>
          </div>

          <nav
            aria-label={dict.site.hero.trades}
            className="enter mt-12"
            style={{ "--enter": 5 } as React.CSSProperties}
          >
            <ul className="flex flex-wrap gap-2">
              {trades.map((trade) => (
                <li key={trade.href}>
                  <Link
                    href={trade.href}
                    className="inline-flex items-center rounded-full border border-space-line-strong/80 bg-white/[0.02] px-3.5 py-1.5 text-sm text-starlight-muted transition-colors duration-[var(--dur-fast)] hover:border-nova-violet/60 hover:text-starlight"
                  >
                    {trade.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollDrift>

        {/* The star, risen on the wave. Decorative: the logo is in the header. */}
        <ScrollDrift distance={140} className="hidden lg:block">
          <div aria-hidden className="relative flex justify-center">
            <div
              className="glow-in absolute size-[26rem] rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgb(90 162 245 / 0.35), rgb(215 107 242 / 0.18) 55%, transparent)",
              }}
            />
            <div className="glow-in relative" style={{ filter: "drop-shadow(0 0 40px rgb(129 122 224 / 0.55))" }}>
              <Mark variant="color" size={260} alt="" />
            </div>
          </div>
        </ScrollDrift>
      </div>
    </section>
  );
}

/**
 * The wave of light: the swoosh of the logo stretched across the sky. A wide
 * glow, a sharp line and, now and then, a pulse of light running along it.
 * `pathLength={1}` lets the CSS draw it with dash offsets from 0 to 1.
 */
function Wave() {
  // Low under the words on the left, rising under the star on the right.
  const path = "M -60 860 C 320 910, 660 760, 920 610 S 1260 440, 1500 330";
  const echo = "M -60 900 C 360 950, 700 820, 960 690 S 1300 530, 1500 450";
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="hero-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1274c6" stopOpacity="0" />
          <stop offset="0.18" stopColor="#2e86ef" />
          <stop offset="0.42" stopColor="#817ae0" />
          <stop offset="0.6" stopColor="#d76bf2" />
          <stop offset="0.76" stopColor="#ef488d" />
          <stop offset="0.9" stopColor="#f47166" />
          <stop offset="1" stopColor="#fca635" stopOpacity="0.4" />
        </linearGradient>
        <filter id="hero-wave-glow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <path d={echo} pathLength={1} className="wave-draw" stroke="url(#hero-wave)" strokeWidth="1" opacity="0.35" />
      <path d={path} pathLength={1} className="wave-draw" stroke="url(#hero-wave)" strokeWidth="14" opacity="0.32" filter="url(#hero-wave-glow)" />
      <path d={path} pathLength={1} className="wave-draw" stroke="url(#hero-wave)" strokeWidth="2" />
      <path d={path} pathLength={1} className="wave-pulse" stroke="#f2f5ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
