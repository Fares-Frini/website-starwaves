import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { BlurHeading } from "@/components/react-bits/blur-heading";
import type { Dictionary } from "@/lib/i18n";

/**
 * The platform, in two sentences per side: what an organiser does with it and
 * what a participant does with it. The heading and its lead are the about
 * page's own; the two sides describe what the product does today.
 */
export function PlatformSplit({ dict, locale }: { dict: Dictionary; locale: string }) {
  const about = dict.marketing.about.sections[2];
  const t = dict.site.platform;
  const sides = [
    { title: t.organisersTitle, body: t.organisersBody, glow: "rgb(90 162 245 / 0.14)", dot: "bg-nova-blue" },
    { title: t.participantsTitle, body: t.participantsBody, glow: "rgb(240 122 174 / 0.14)", dot: "bg-nova-pink" },
  ];

  return (
    <section className="theme-space section-y relative isolate overflow-hidden bg-space-950">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="starfield opacity-30" />
        <div
          className="nebula -top-32 end-[-8%] size-[34rem]"
          style={{ background: "radial-gradient(closest-side, rgb(46 134 239 / 0.22), transparent)" }}
        />
      </div>
      <div className="container-site">
        <header className="max-w-2xl">
          <BlurHeading text={about.heading} className="font-display text-h2 font-medium text-starlight" />
          <Reveal index={3}>
            <p className="mt-5 text-lead text-starlight-muted">{about.body}</p>
          </Reveal>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {sides.map((side, index) => (
            <Reveal key={side.title} index={index}>
              <Spotlight
                color={side.glow}
                className="h-full rounded-panel border border-space-line bg-space-900/70 p-8 shadow-panel"
              >
                <p className="flex items-center gap-3 font-display text-h3 font-medium text-starlight">
                  <span aria-hidden className={`size-2 rounded-full ${side.dot}`} />
                  {side.title}
                </p>
                <p className="mt-4 text-starlight-muted">{side.body}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <p className="mt-8">
          <Link
            href={`/${locale}/platform`}
            className="inline-flex items-center gap-2 text-sm font-medium text-nova-blue underline-offset-4 hover:underline"
          >
            {t.discover}
            <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none" className="rtl:rotate-180">
              <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </p>
      </div>
    </section>
  );
}
