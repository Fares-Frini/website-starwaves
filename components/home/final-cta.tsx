import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BlurHeading } from "@/components/react-bits/blur-heading";
import { StarLink } from "@/components/motion/star-link";
import type { Dictionary } from "@/lib/i18n";

/**
 * The last word: one question to an organiser, and the two ways forward. A
 * small echo of the hero — the star, a glow — so the page ends where it began.
 *
 * The one place on the page where the main action is pushed: a star orbits
 * the button (React Bits' StarBorder), with an extra lap on hover or focus.
 */
export function FinalCta({ dict, locale }: { dict: Dictionary; locale: string }) {
  return (
    <section className="theme-space relative isolate overflow-hidden bg-space-950 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="starfield opacity-60" />
        <div
          className="nebula left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, rgb(129 122 224 / 0.35), rgb(239 72 141 / 0.12) 60%, transparent)" }}
        />
      </div>
      <div className="container-site flex flex-col items-center text-center">
        <Reveal>
          <span aria-hidden className="block" style={{ filter: "drop-shadow(0 0 24px rgb(129 122 224 / 0.6))" }}>
            <Mark variant="color" size={56} alt="" />
          </span>
        </Reveal>
        <BlurHeading
          text={dict.site.cta.title}
          className="mt-8 max-w-3xl font-display text-h1 font-medium text-starlight"
        />
        <Reveal index={3} className="flex flex-col items-center">
          <p className="mt-5 max-w-xl text-lead text-starlight-muted">{dict.site.cta.body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <StarLink href={`/${locale}/contact`}>{dict.site.nav.organise}</StarLink>
            <Button asChild variant="orbit" size="lg">
              <Link href={`/${locale}/events`}>{dict.home.heroBrowse}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
