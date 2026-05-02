<div align="center">
  <img src="repository_assets/headshot.png" alt="Gyanesh Samanta" width="180">

  <h1>Gyanesh Samanta — Portfolio</h1>
  <p><strong>A wiki-driven, sticky-stack portfolio. One markdown file ships the whole site.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Framer_Motion-12-EF4DA0?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
    <img src="https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
    <img src="https://img.shields.io/github/last-commit/GyaneshSamanta/Portfolio-Website?style=for-the-badge&color=ff00ea" alt="Last commit">
  </p>
</div>

---

## About — the 5 Ws

**What.** A personal portfolio for Gyanesh Samanta — built on Next.js 14, Tailwind CSS, and Framer Motion, with a single-source-of-truth content system: edit `wiki.md`, push to GitHub, Vercel rebuilds, the site updates. No CMS, no headless API, no admin dashboard.

**Who.** Designed and built solo by **Gyanesh Samanta**.

**When.** Built between **February 8 and April 8, 2026**, across roughly a dozen iterative commits — from initial scaffolding to the wiki-driven CMS pivot to the final design polish.

**Where.** Lives at [gyaneshsamanta.com](https://gyaneshsamanta.com) on Vercel — also serves as the calling card linked from LinkedIn, hackathon pages, and the [Gyanesh on Product](https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/) newsletter.

**Why.** Most portfolios decay because updating them is a chore — open the editor, hunt down the right component, redeploy. This site solves that by collapsing the entire content surface into one markdown file. The build script parses sections, validates them, and emits typed JSON the components consume. Updating my hackathon wall takes one PR.

---

## The Story

The first version was a normal Next.js project — components owned their own copy. Editing a recommendation meant opening `recommendations.tsx`, scrolling past JSX, mutating an array. Updating my projects meant doing it again. After the third "I'll fix that this weekend" that didn't happen, the architecture got rewritten around a single principle: **content is data, code is presentation, never the twain shall meet.**

Enter `wiki.md`: one markdown file at the repo root, sectioned with `## SECTION_NAME` headers and `<!-- SECTION_END -->` terminators, with multi-item sections (experience, projects, hackathons, recommendations) using `### Item Title | Field 2 | Field 3` micro-grammars. A pre-build script (`scripts/sync-wiki.mjs`) parses the file, runs schema validation per-section (so one bad block can't take the site down), and emits typed JSON into `data/`. Tailwind's JIT, Framer Motion's transitions, and Next.js 14's App Router handle everything else.

The visual layer leans into a few opinionated motifs: a **sticky-stack scroll** where each section pins on top of the next like a deck of cards, a **two-state navbar** that morphs from expanded-on-home to compact-and-blurred-on-scroll, an **animated loading screen** with rotating digits, an **alternating dark/light theme** between sections, a **recommendation marquee** that pulls headshot photos (with monogram fallbacks if there's no photo), and a **hackathon trophy wall** showcasing wins with team and stack details. Every CTA is a real button: a Cal.com booking widget loads lazily for Core Web Vitals, dynamic OG images render rich previews for LinkedIn/Twitter/Slack, and a custom CSP plus `X-Frame-Options` / `Permissions-Policy` keep the production headers tight.

The whole thing is roughly **15 sections** rendered from one markdown file, **~17 runtime dependencies**, and a custom palette of `#982598 · #15173D · #E491C9 · #F1E9E9` tying it all together.

---

## Gallery

![Landing Page](Design%20references/Landing%20Page.png)

![Loading Screen](Design%20references/Loading%20Screen.png)

![Recommendations Design Reference](Design%20references/Recommendations%20Design%20Reference.png)

![Top Bar — Home State](Design%20references/Top%20bar%20on%20home%20page.png)

![Top Bar — Scrolled State](Design%20references/top%20bar%20on%20scroll.png)

![Newsletter Cover](public/newsletter%20cover.png)

---

## Features

- **Wiki-Driven CMS** — `wiki.md` is the single source of truth; build-time parser writes typed JSON to `data/`
- **Sticky-Stack Scroll** — sections stack like cards as you scroll
- **Two-State Navbar** — expanded on home, compact + blurred on scroll
- **Loading Screen** — animated rotating digits with a count-up loader
- **Alternating Themes** — dark/light sections with smooth transitions
- **Recommendation Marquee** — auto-scrolling testimonials with avatar photos and monogram fallbacks
- **Hackathon Trophy Wall** — grid of wins with tech stacks and teammates
- **Skills & Expertise** — categorized across Data, AI, Product, and Engineering
- **Animated Stats** — hero badges with count-up on first view
- **Project Filter Tags** — filter by tech tag with smooth transitions
- **Reading Time Badges** — on every newsletter article card
- **Dynamic OG Images** — rich social previews for LinkedIn, Twitter, Slack
- **Section Navigation** — right-side dot indicators with hover labels
- **Cal.com Integration** — lazy-loaded booking widget
- **Security Headers** — CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Fail-Safe Build** — malformed `wiki.md` falls back to the last known good data per-section

---

## Tech Stack

| Layer | Tech |
| :--- | :--- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + custom CSS |
| Animation | Framer Motion 12 |
| Smooth Scroll | Lenis + @studio-freight/lenis |
| Icons | lucide-react |
| Booking | react-calendly + Cal.com embed |
| Analytics | @vercel/speed-insights |
| Deployment | Vercel |

---

## Editing Content (`wiki.md`)

All website content lives in **`wiki.md`** at the repo root.

**Workflow.** Edit `wiki.md` → commit & push → Vercel rebuilds → live. No code changes for content updates.

**Format.**
- Sections start with `## SECTION_NAME` and end with `<!-- SECTION_END -->`
- Single-value content uses `- key: value`
- Multi-item sections use `### Item Title | Field 2 | Field 3` headers

**Manual sync.**
```bash
npm run sync         # runs scripts/sync-wiki.mjs against wiki.md → data/*.json
```

**Image paths.** In `wiki.md`, prefix images with `public/` (e.g. `public/images/foo.jpg`); the parser strips the `public/` segment for Next.js serving.

**Recommendations.** Drop headshots in `public/images/recommendations/` and reference them as `photo: public/images/recommendations/person.jpg`. If no photo, a monogram avatar renders.

**Fail-safe.** If `wiki.md` is missing or a section is malformed, the build falls back to the last known good data for that section — one bad block can't break the site.

---

## Repository Structure

```
Portfolio-Website/
├── wiki.md                  # Single source of truth for all content
├── scripts/
│   ├── sync-wiki.mjs        # Parser: wiki.md → data/*.json
│   └── wiki-validator.mjs   # Schema validation helpers
├── app/                     # Next.js App Router pages
│   ├── globals.css          # Brand palette + theme system
│   ├── layout.tsx           # Root layout (Cal.com lazy-load, OG meta)
│   ├── page.tsx             # Homepage with all sections
│   └── opengraph-image.tsx  # Dynamic OG image generation
├── components/
│   ├── navbar.tsx           # Two-state navigation
│   ├── footer.tsx           # LinkedIn / GitHub / Email
│   ├── section-nav.tsx      # Right-side dot navigation
│   ├── sections/            # Hero, Journey, Research, Projects, Hackathons, ...
│   └── ui/                  # Loading screen, cursor, audio toggle
├── data/                    # Auto-generated JSON (do not edit by hand)
├── hooks/                   # useCountUp, useUISounds
├── lib/                     # Constants & utilities
├── public/
│   ├── newsletter cover.png
│   └── images/recommendations/
├── Design references/       # Original Figma exports
├── repository_assets/       # README assets
└── next.config.mjs          # Security headers, image config
```

---

## Local Development

```bash
npm install                  # installs deps; postinstall runs sync-wiki
npm run dev                  # auto-syncs wiki.md, then starts Next dev
npm run build                # production build (with sync)
npm run sync                 # sync wiki.md manually
npm start                    # preview production build
npm run lint                 # next lint
```

---

## Security

Production security headers configured in `next.config.mjs`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — restricts scripts/styles/frames to trusted sources
- `Permissions-Policy` — disables camera, microphone, geolocation

---

## Mobile

- Responsive hero (vertical stack on mobile)
- Hamburger menu with animated slide-in
- Touch-friendly cards and tap targets
- Recommendation cards at 350px on mobile
- Optimized gradient fade edges

---

## Contributing

```bash
# 1. Fork on GitHub
git clone https://github.com/<you>/Portfolio-Website.git
cd Portfolio-Website
git checkout -b feat/your-tweak

# 2. Edit wiki.md or components, run dev
npm install && npm run dev

# 3. Commit, push, open a PR
git commit -m "feat: short description"
git push origin feat/your-tweak
```

---

## License

© 2026 Gyanesh Samanta. All rights reserved.

---

## Credits

- **Gyanesh Samanta** — design, content, code ([LinkedIn](https://www.linkedin.com/in/gyanesh-samanta/) · [@GyaneshSamanta](https://github.com/GyaneshSamanta))
- Deployed via Vercel's automated CI
