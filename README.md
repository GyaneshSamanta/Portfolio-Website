# Gyanesh Samanta — Portfolio Website

> The personal product surface of a PM at the intersection of **Data, AI, and Consumer Behaviour**.
> Built with Next.js 14, Tailwind CSS, Framer Motion, and a strong opinion that portfolios should ship.

**Live:** [gyane.sh](https://gyane.sh) · **Source:** [github.com/GyaneshSamanta/Portfolio-Website](https://github.com/GyaneshSamanta/Portfolio-Website)

---

## Why this site exists

A PM's portfolio is not a designer portfolio (it doesn't need to dazzle visually as proof of craft) and not a developer portfolio (it doesn't need a code repo as the centerpiece). It's a **product surface for the brand** — and the bar for "good" PM portfolios is depressingly low.

This site aims to be in the top 5% by doing four things differently from most PM portfolios:

1. **Lead with a POV, not a resume.** Hero subhead is a thesis ("PM with T-shaped skills"), not "experienced PM with X years…"
2. **Prove I ship.** A live GitHub heartbeat ("Now Shipping" bento with snake chart + commit feed) replaces static badges.
3. **Writing > everything.** All 48 LinkedIn newsletter editions are mirrored in-site at `/blog`, full reader with branded covers — no jump-out.
4. **One personality moment per section.** Kinetic name, walking-figure journey, single auto-rotating iPhone with Shorts.

---

## Architecture at a glance

```
app/                  Next.js 14 App Router
├── layout.tsx        Root layout · cursor · noise texture · progress rail
├── page.tsx          Home — composes all 8 sections in order
├── blog/             /blog (index) + /blog/[slug] (reader)
└── globals.css       Design tokens + .article-prose typography

components/
├── sections/         One per home section (hero, now-shipping, journey, …)
├── now-shipping/     Tile primitives (live commit, snake, achievements, newsletter)
├── journey/          Polaroid + walking-figure
├── work/             Repos marquee + research grid
├── podcast/          ShortsPhone (single iPhone, auto-rotates)
├── blog/             Reading progress + share + article shell
├── ui/               Generic primitives (bento-tile, cursor-circle, lite-youtube,
│                     noise-texture, progress-rail, skill-marquee, loading-screen)
├── layout/           SmoothScroll (Lenis wrapper)
├── navbar.tsx        Floating glassy navbar → compact pill on scroll
└── footer.tsx        Three-column footer with socials

lib/
├── github.ts         GitHub REST + GraphQL helpers (push events, contributions, repos)
├── youtube.ts        YouTube playlist scraper (no API key, ISR 6h)
├── blog.ts           Reads data/blog.json + content/blog/*.html
├── time.ts           formatRelativeTime helper
├── constants.ts      SITE_CONFIG (single source for metadata URLs)
└── utils.ts          cn() class merger

data/                 Eight JSON files (see DATA.md for editing guide)
content/blog/         48 sanitized article bodies (one HTML per slug)
public/images/        Hero · logos · recommendations · papers · blog covers
scripts/              Five one-shot importers (see Scripts section below)
```

**Section order (single-page scroll):**

1. **Hero** — kinetic name, T-shaped tagline, dual CTA, headshot with ambient aura
2. **Now Shipping** — `PM who builds.` — live commit feed + GitHub snake chart + latest newsletter + achievements row
3. **The Journey** — horizontal scroll-jacked walk through career milestones (vertical fallback on mobile)
4. **Selected Work** — Open-source repos marquee + 3-card IEEE research grid
5. **Newsletter** — `Gyanesh on Product` — magazine featured + 4 compact cards, links to in-site reader
6. **Podcast** — Long-form episodes left + single auto-rotating Shorts iPhone right
7. **Wall of Love** — Masonry of 14 full-text recommendations
8. **Contact** — Centered editorial CTA with Cal.com booking + email click-to-copy

---

## Editing content

**The short version:** All visible text + dates + tags live in `data/*.json`. See [DATA.md](./DATA.md) for the full guide.

| To change… | Edit… |
|---|---|
| Hero tagline, subhead, CTAs, badges | `data/hero.json` |
| Career timeline cards | `data/journey.json` |
| Selected research papers | `data/work.json` |
| Recommendations | `data/recommendations.json` |
| Contact section copy + URLs | `data/contact.json` + `data/meta.json` |
| Footer name, copyright, social links | `data/footer.json` |
| Newsletter posts | `data/blog.json` (auto-generated; run `npm run blog:import`) |
| Site-wide metadata | `lib/constants.ts` |

---

## Editing assets

| Asset type | Location | Naming |
|---|---|---|
| Headshot | `public/images/hero/headshot.jpg` | Single file |
| Company logos | `public/images/logos/<slug>.{jpeg,png,svg}` | Slug matches `data/journey.json` `logo` field |
| Recommender headshots | `public/images/recommendations/<slug>.{jpeg,png}` | Slug = `data/recommendations.json` `slug` field |
| Newsletter banners | `public/images/blog/<slug>/cover.webp` | Slug = `data/blog.json` `slug` field. Auto-generated SVGs serve as fallback. |
| Research paper covers | `public/images/papers/<id>.svg` | Auto-generated by `npm run papers:generate` |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on `:3000` |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `node scripts/import-blog.mjs` | Import LinkedIn HTML article exports → `data/blog.json` + `content/blog/*.html` |
| `node scripts/generate-blog-covers.mjs` | Generate auto-branded SVG covers for posts without real banners |
| `node scripts/map-newsletter-banners.mjs` | Map Canva-designed PNG banners from `Newsletter Banners/` folder → `public/images/blog/<slug>/cover.png`, with auto-WebP conversion |
| `node scripts/generate-paper-covers.mjs` | Generate branded SVG covers for IEEE research papers |
| `node scripts/strip-broken-inline-images.mjs` | Remove `<img>` tags pointing to expired LinkedIn CDN URLs from blog HTML |

---

## Dynamic data sources

The portfolio fetches three dynamic data feeds at request time (with ISR caching):

1. **GitHub** — `lib/github.ts` calls `/users/<user>/events/public` for the live commit feed, `/users/<user>/repos` for the Selected Work marquee, GraphQL `contributionsCollection` for the heatmap (optional, requires `GITHUB_TOKEN`).
2. **YouTube** — `lib/youtube.ts` scrapes the public playlist HTML server-side (no API key) for both long-form episodes and Shorts. Bypasses YouTube's consent gate via the `CONSENT=YES+cb` cookie.
3. **GitHub Snake** — Static SVG fetched from `raw.githubusercontent.com/GyaneshSamanta/GyaneshSamanta/output/github-contribution-grid-snake-dark.svg`, auto-rendered daily by [Platane/snk](https://github.com/Platane/snk).

ISR caching keeps the page fast (no per-request fetch) but data stays effectively live (refreshes 4× per day).

### Optional env vars

| Var | Effect |
|---|---|
| `GITHUB_TOKEN` | Lifts GitHub API rate limit from 60→5,000/hr · enables contributions GraphQL heatmap |

---

## Design system

- **Dark-only** palette. CSS tokens in `app/globals.css`, semantic Tailwind names in `tailwind.config.ts`.
- **Brand colors:** `--brand-magenta` (#ED2EBA) · `--brand-violet` (#8E3DEF) · `--brand-pink` (#E491C9) · `--brand-purple` (#982598).
- **Typography:** Geist Sans (body) + Instrument Serif (editorial italic moments) + Geist Mono (data, captions).
- **Motion tokens:** `--motion-fast` 200ms · `--motion-base` 400ms · `--motion-slow` 800ms.
- **`prefers-reduced-motion`** is respected across every animated component (cursor, marquees, walking figure, blob mask).

---

## Stack

- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS
- Framer Motion
- lite-youtube-embed
- Lenis (smooth scroll)
- Vercel Speed Insights

No CMS. No analytics-heavy bloat. ~167 KB First Load on `/`.

---

## Built with help from Claude

Significant portions of this codebase were designed and implemented in collaboration with Claude (Anthropic). The full design + implementation handoff lives in `Design Handoff/DESIGN.md` and `IMPLEMENTATION.md`.
