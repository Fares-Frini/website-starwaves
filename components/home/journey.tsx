import { Reveal } from "@/components/motion/reveal";
import { BlurHeading } from "@/components/react-bits/blur-heading";
import type { Dictionary } from "@/lib/i18n";
import { JourneyRail } from "./journey-rail";

/**
 * How an event runs with Starwaves, step by step. This content really is a
 * sequence — the order an event happens in — so it is numbered, on a line of
 * light that fills as the reader moves down it.
 */
export function Journey({ dict }: { dict: Dictionary }) {
  const t = dict.site.journey;

  return (
    <section className="theme-space section-y relative overflow-hidden bg-space-900">
      <div aria-hidden className="starfield opacity-30" />
      <div className="container-site relative grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <BlurHeading text={t.title} className="font-display text-h2 font-medium text-starlight" />
          <Reveal index={3}>
            <p className="mt-5 max-w-md text-lead text-starlight-muted">{t.lead}</p>
          </Reveal>
        </header>

        <JourneyRail>
          <ol className="space-y-10">
            {t.steps.map((step, index) => (
              <Reveal as="li" key={step.title} className="relative ps-16">
                <span
                  aria-hidden
                  className="journey-dot absolute start-0 top-0 flex size-10 items-center justify-center rounded-full border border-space-line-strong bg-space-950 font-display text-sm text-starlight-subtle"
                >
                  {index + 1}
                </span>
                <h3 className="pt-1.5 font-display text-h3 font-medium text-starlight">{step.title}</h3>
                <p className="mt-2 max-w-xl text-starlight-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </JourneyRail>
      </div>
    </section>
  );
}
