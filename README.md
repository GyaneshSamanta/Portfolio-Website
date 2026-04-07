# Gyanesh Samanta — Portfolio Website

> Personal portfolio website built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**

---

## ✨ Features

- **Wiki-Driven CMS** — Edit `wiki.md` to update all content; build-time parser writes JSON consumed by components
- **Sticky-Stack Scroll** — Sections stack on top of each other as you scroll, creating a card-like browsing experience
- **Loading Screen** — Animated intro with rotating digits and loading counter
- **Two-State Navbar** — Expanded on home, compact & blurred on scroll
- **Alternating Themes** — Dark/light sections with smooth transitions
- **Recommendation Marquee** — Auto-scrolling testimonials with avatar photos and monogram fallbacks
- **Hackathon Trophy Wall** — Grid showcase of hackathon wins with tech stacks and team details
- **Skills & Expertise** — Categorized skill display across Data, AI, Product, and Engineering
- **Animated Stats** — Hero badges with count-up animation on first view
- **Project Filter Tags** — Filter projects by technology tag with smooth transitions
- **Reading Time Badges** — Time estimates on newsletter article cards
- **Dynamic OG Images** — Rich social previews for LinkedIn, Twitter, and Slack shares
- **Gradient Design System** — Custom palette: `#982598` · `#15173D` · `#E491C9` · `#F1E9E9`
- **Section Navigation** — Right-side dot indicators with labels on hover
- **Cal.com Integration** — Lazy-loaded booking widget for better Core Web Vitals
- **Security Headers** — CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS |
| Animations | Framer Motion |
| Booking | Cal.com embed |
| Deployment | Vercel |

---

## ✏️ Editing Content (wiki.md CMS)

All website content is managed through a single file: **`wiki.md`** in the repo root.

### How it works
1. Edit `wiki.md` — update text, links, images, or add new items
2. Commit & push → Vercel auto-deploys → content is live
3. No code changes needed for content updates

### wiki.md Structure
Each section starts with `## SECTION_NAME` and ends with `<!-- SECTION_END -->`. Content uses `- key: value` format. Multi-item sections (experience, projects, etc.) use `### Item Title | Field 2 | Field 3` headers.

### Sync Script
The parser runs automatically via `npm run dev` / `npm run build`. You can also run it standalone:
```bash
npm run sync
```
This reads `wiki.md` and writes individual JSON files to `data/` (e.g., `experience.json`, `projects.json`, etc.).

### Image Paths
- In `wiki.md`: use `public/images/filename.ext`
- The parser strips the `public/` prefix for Next.js serving

### Recommendation Photos
Place headshot images in `public/images/recommendations/` and reference them in wiki.md:
```
- photo: public/images/recommendations/person-name.jpg
```
If no photo is provided, a monogram avatar is displayed automatically.

### Fail-Safe
If `wiki.md` is missing or malformed, the site builds with the last-known-good data. Individual sections are validated independently — one bad section won't break others.

---

## 📁 Project Structure

```
├── wiki.md              # Single source of truth for all content
├── scripts/
│   ├── sync-wiki.mjs    # Parser: wiki.md → data/*.json
│   └── wiki-validator.mjs  # Schema validation helpers
├── app/                 # Next.js App Router pages
│   ├── globals.css      # Brand palette & theme system
│   ├── layout.tsx       # Root layout with Cal.com embed
│   ├── page.tsx         # Homepage with all sections
│   └── opengraph-image.tsx  # Dynamic OG image generation
├── components/
│   ├── navbar.tsx        # Two-state navigation
│   ├── footer.tsx        # LinkedIn, GitHub, Email
│   ├── section-nav.tsx   # Right-side dot navigation
│   ├── sections/         # Hero, Journey, Research, Projects, Hackathons, Writing, Skills, Recommendations
│   └── ui/               # Loading screen, cursor, audio toggle
├── data/                # Auto-generated JSON files (do not edit manually)
├── hooks/               # useCountUp, useUISounds
├── lib/                 # Constants & utilities
└── public/
    └── images/
        └── recommendations/  # Recommender headshot photos
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server (auto-syncs wiki.md first)
npm run dev

# Build for production
npm run build

# Sync wiki.md manually
npm run sync

# Preview production build
npm start
```

---

## 🔒 Security

Production security headers configured in `next.config.mjs`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — Restricts scripts/styles/frames to trusted sources
- `Permissions-Policy` — Disables camera, microphone, geolocation

---

## 📱 Mobile

- Responsive hero layout (vertical stack on mobile)
- Hamburger menu with animated slide-in
- Touch-friendly card sizes and tap targets
- Recommendation cards at 350px on mobile
- Optimized gradient fade edges

---

## 📄 License

© 2026 Gyanesh Samanta. All rights reserved.
