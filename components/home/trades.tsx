import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { BlurHeading } from "@/components/react-bits/blur-heading";
import { Spotlight } from "@/components/motion/spotlight";
import type { Dictionary } from "@/lib/i18n";

/**
 * The three trades, as an editorial spread rather than an icon grid: the claim
 * on the left, the three ways in on the right, each a panel lit by the pointer.
 * Audiovisual production carries its own lockup, Starwaves Productions.
 *
 * Every word is the site's existing copy: the about page's "three trades" and
 * each solution page's own title and lead.
 */
export function Trades({ dict, locale }: { dict: Dictionary; locale: string }) {
  const m = dict.marketing;
  const trades = [
    { href: `/${locale}/solutions/congresses`, title: m.congresses.title, lead: m.congresses.lead, glow: "rgb(90 162 245 / 0.16)" },
    { href: `/${locale}/solutions/corporate`, title: m.corporate.title, lead: m.corporate.lead, glow: "rgb(167 156 240 / 0.16)" },
    { href: `/${locale}/solutions/productions`, title: m.productions.title, lead: m.productions.lead, glow: "rgb(240 122 174 / 0.16)", productions: true },
  ];

  return (
    <section className="theme-space section-y relative isolate overflow-hidden bg-space-950">
      {/* The same sky as the hero, fainter: the page stays in space. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="starfield opacity-35" />
        <div
          className="nebula -end-56 top-1/4 size-[36rem]"
          style={{ background: "radial-gradient(closest-side, rgb(129 122 224 / 0.22), transparent)" }}
        />
      </div>
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <BlurHeading text={dict.site.trades.title} className="font-display text-h2 font-medium text-starlight" />
          <Reveal index={3}>
            <p className="mt-5 max-w-md text-lead text-starlight-muted">{m.about.sections[1].body}</p>
          </Reveal>
        </header>

        <ul className="space-y-4">
          {trades.map((trade, index) => (
            <Reveal as="li" key={trade.href} index={index}>
              <Spotlight
                color={trade.glow}
                className="rounded-panel border border-space-line bg-space-900/70 shadow-panel transition-colors duration-[var(--dur-base)] hover:border-space-line-strong"
              >
                <Link href={trade.href} className="block p-7 sm:p-9">
                  <span className="flex items-start justify-between gap-6">
                    <span>
                      <span className="block font-display text-h3 font-medium text-starlight">
                        {trade.title}
                      </span>
                      <span className="mt-3 block max-w-lg text-starlight-muted">{trade.lead}</span>
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-space-line-strong text-starlight transition-[transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover/spot:translate-x-1 group-hover/spot:border-nova-blue/60 rtl:rotate-180"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                  {trade.productions ? (
                    <span className="mt-6 block opacity-80">
                      <Logo lockup="sw-prod" variant="color-white" height={22} alt="Starwaves Productions" />
                    </span>
                  ) : null}
                  <span className="sr-only">{dict.site.trades.discover}</span>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
