# Starwaves — showcase website

The public face of Starwaves: who we are, what we do, and the events open to the
public. A separate project from the platform (`../starwaves-frontend`).

**It has no accounts and no session.** It never reads a cookie and never calls an
authenticated endpoint, so every visitor sees the same page and it can be cached or
served from a CDN. The *Sign in*, *Sign up* and *Register* buttons are plain links to
the platform, which decides what happens next: somebody already signed in goes
straight to their space, everybody else gets the sign-in form and is brought back.

## Run

```bash
npm install
cp .env.example .env.local    # then adjust the two addresses if needed
npm run dev                   # http://localhost:3200
```

It needs the API running to list events (`API_ORIGIN`). If the API is down the rest of
the site still works and the event list is empty.

| Variable | Meaning | Default |
|---|---|---|
| `API_ORIGIN` | the platform's API (public events are read from it) | `http://localhost:3000` |
| `NEXT_PUBLIC_PLATFORM_URL` | the platform, target of every sign-in / sign-up / register link | `http://localhost:3100` |
| `NEXT_PUBLIC_SITE_URL` | this site's public address: canonical links, hreflang, sitemap, sharing cards, structured data | `http://localhost:3200` |
| `SITE_NOINDEX` | `1` on a staging copy: robots.txt disallows everything and pages say `noindex` (a localhost address is never indexed) | `0` |

The platform has the matching setting, `WEBSITE_URL` (default `http://localhost:3200`):
its old public addresses (`/events`, `/about`, …) redirect here.

## Pages

Home, events (list and detail), the platform, three solutions, about, contact, FAQ,
guides, legal. Text is French and English (`lib/i18n/dictionaries`).

## Search and performance

- Every page has its canonical address, `hreflang` alternates (fr, en, x-default),
  Open Graph and Twitter cards with a generated sharing image (one per language,
  one per event), and a description of its own (`lib/seo.ts`, `site.seo` in the
  dictionaries). `/robots.txt` and `/sitemap.xml` are generated (`app/robots.ts`,
  `app/sitemap.ts`). Structured data: Organization + WebSite on the home page,
  Event + BreadcrumbList on each event.
- Event pages are cached for 60 s (ISR). If the API is down a known event keeps its
  last good page and an unknown one gets a temporary error — never a 404.
- Only the latin subset of the fonts is preloaded. The WebGL sky only runs on capable
  desktops; phones get the CSS sky, and nothing animates endlessly off screen.

## Notes

- The dictionaries are a copy of the platform's, including many strings this site does
  not use. Trimming them to what the site shows is still to do.
- `npm run typecheck` and `npm run lint` are clean; there are no tests yet.
