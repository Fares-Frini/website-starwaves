import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The sharing card (1200×630) shown when a page is posted on a social network
 * or a messaging app: the night sky of the site, the Starwaves star, a title
 * and a line under it. Rendered to PNG by `next/og` from the segment's
 * `opengraph-image.tsx`; plain inline styles, because that renderer only
 * understands a subset of CSS (flexbox, no classes).
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** The colour mark, as a data URL the image renderer can draw. */
export async function markDataUrl(): Promise<string> {
  const svg = await readFile(path.join(process.cwd(), "public/brand/mark-color.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

export function OgCard({
  mark,
  kicker,
  title,
  subtitle,
  gradientTitle,
}: {
  mark: string;
  /** Small line above the title (the brand, or the event's type). */
  kicker: string;
  title: string;
  /** Under the title: the promise, or the event's dates and city. */
  subtitle?: string;
  /** A second title line in the brand gradient (the home card). */
  gradientTitle?: string;
}) {
  const long = title.length > 48;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#060914",
        backgroundImage:
          "radial-gradient(circle at 85% 20%, rgba(46,134,239,0.45), transparent 45%), radial-gradient(circle at 10% 90%, rgba(239,72,141,0.30), transparent 45%), radial-gradient(circle at 60% 110%, rgba(129,122,224,0.35), transparent 50%)",
        color: "#f2f5ff",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* A few stars. */}
      {[
        [120, 90, 3],
        [380, 60, 2],
        [700, 140, 2],
        [980, 70, 3],
        [1100, 300, 2],
        [860, 520, 2],
        [520, 560, 3],
        [60, 420, 2],
      ].map(([x, y, r], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: r,
            height: r,
            borderRadius: 9999,
            background: "#f2f5ff",
            opacity: 0.8,
          }}
        />
      ))}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og */}
          <img src={mark} width={64} height={59} alt="" />
          <span style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#b6c0da" }}>
            {kicker}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <span style={{ fontSize: long ? 60 : 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>
            {title}
          </span>
          {gradientTitle ? (
            <span
              style={{
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1,
                marginTop: 8,
                backgroundImage: "linear-gradient(100deg, #5aa2f5 0%, #a79cf0 38%, #f07aae 70%, #fcb65a 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {gradientTitle}
            </span>
          ) : null}
          {subtitle ? (
            <span style={{ marginTop: 28, fontSize: 32, color: "#b6c0da", lineHeight: 1.35 }}>{subtitle}</span>
          ) : null}
        </div>
        <div
          style={{
            height: 4,
            width: 260,
            borderRadius: 9999,
            backgroundImage: "linear-gradient(90deg, #2e86ef, #817ae0, #d76bf2, #ef488d, #fca635)",
          }}
        />
      </div>
    </div>
  );
}
