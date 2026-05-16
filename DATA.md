# Editing content — DATA.md

This is the operator's guide. **All visible text on the site is JSON.** Edit the file,
push to `main`, Vercel deploys automatically. No code changes required.

---

## The 8 data files

```
data/
├── hero.json              Hero section — name, tagline, subhead, CTAs, skills marquee
├── journey.json           Career timeline cards (12 milestones)
├── work.json              Research papers (3 IEEE publications)
├── blog.json              Newsletter manifest (48 entries) — auto-generated
├── recommendations.json   Wall of Love (14 LinkedIn recommendations)
├── contact.json           Contact section copy
├── footer.json            Footer name, tagline, links, socials
└── meta.json              Site metadata — phone, emails, social URLs
```

---

## hero.json

```jsonc
{
  "nameFirst": "Gyanesh",
  "nameLast": "Samanta",

  // Two-line headline. headlineHighlight renders italic with gradient flow.
  "headline": "PM with",
  "headlineHighlight": "T-shaped skills",
  "headlineFollowup": "in Data Storytelling, Consumer Behaviour & AI.",

  // Body paragraph beneath the headline. Plain text.
  "subheadline": "I think in systems. I build in products. I write about both…",

  // Two CTA buttons.
  "ctaPrimaryLabel": "Book a Call",
  "ctaPrimaryUrl": "https://cal.com/gyaneshsamanta",
  "ctaSecondaryLabel": "Read my Newsletter",
  "ctaSecondaryUrl": "https://www.linkedin.com/...",

  // Headshot — file lives at public/images/hero/headshot.jpg
  "heroImage": "/images/hero/headshot.jpg",
  "heroImageAlt": "Gyanesh Samanta — Product Manager",

  // Achievements row at the bottom of Now Shipping. 4 strings.
  // Number-prefix gets auto-animated count-up on scroll.
  "badges": ["48 Newsletter Editions", "15+ Hackathon Wins", "3 Published Papers", "1000+ Subscribers"],

  // Skill marquee chips (3 rows on desktop, 2 on mobile). Add as many as you want.
  "skills": ["Product Management", "Data Storytelling", …]
}
```

---

## journey.json

An array of milestone objects, **chronological order** (oldest first). Each card:

```jsonc
{
  "id": "ibm-2025",                      // unique slug, used as React key
  "year": "2025",                        // shown on the card
  "type": "internship",                  // education | role | internship | milestone
  "org": "IBM",                          // shown prominently
  "title": "Product Manager Intern — B2B",
  "dates": "Apr 2025 — Jun 2025",
  "logo": "/images/logos/ibm.jpeg",      // see Logos guide below
  "location": "Bengaluru, India",
  "shipped": "Sterling OMS — …",         // one-liner on the polaroid
  "description": "First taste of B2B …", // shown in the modal
  "tags": ["B2B", "Product Management"],
  "color": "magenta"                     // purple | pink | violet | magenta
  // Optional: "isFuture": true for "what's next" cards (dashed border)
}
```

---

## work.json

3 IEEE research papers. Each:

```jsonc
{
  "id": "pegasus-spyware",              // slug — matches generated SVG cover filename
  "category": "research",
  "title": "Pegasus Spyware: An Attack System Artemis",
  "subtitle": "IEEE ICECAA · Aug 2023",
  "description": "Co-authored study …",
  "coverImage": "/images/papers/pegasus-spyware.svg",  // auto-generated
  "tags": ["Cybersecurity", "Behavioral Analysis", "Research"],
  "metrics": [{ "label": "Venue", "value": "IEEE" }, …],
  "links": [{ "label": "Read on IEEE", "url": "https://…" }]
}
```

To add a new paper: append to `work.json`, then run `node scripts/generate-paper-covers.mjs`
after updating the `PAPERS` array inside that script.

---

## recommendations.json

14 LinkedIn recommendations. Each:

```jsonc
{
  "slug": "adamya-singh",                // determines photo filename
  "name": "Adamya Singh",
  "designation": "Product Manager",
  "company": "IBM",
  "companyLogo": "/images/logos/ibm.jpeg",
  "relationship": "Manager at IBM",
  "photo": "/images/recommendations/adamya-singh.jpeg",
  "photoAlt": "Adamya Singh headshot",
  "linkedinUrl": "https://www.linkedin.com/in/adamya-singh",
  "shortQuote": "Outstanding intern …",   // one-line teaser (unused on Wall of Love masonry)
  "fullText": "It is my pleasure to recommend Gyanesh …",  // full text rendered on card
  "date": "Jun 2025"
}
```

To add a new recommendation:
1. Add the JSON entry
2. Drop the headshot into `public/images/recommendations/<slug>.jpeg`
3. Drop the company logo (if not already present) into `public/images/logos/<slug>.jpeg`

---

## blog.json — DO NOT EDIT MANUALLY

The blog manifest is **auto-generated** from LinkedIn newsletter HTML exports.

To add a new newsletter edition:

1. Export your LinkedIn newsletter article as HTML
2. Drop the file into `LinkedIn Data/Complete_LinkedInDataExport_<date>.zip/Articles/Articles/<slug>.html`
3. Run `node scripts/import-blog.mjs`
4. Run `node scripts/generate-blog-covers.mjs` (generates branded SVG fallback covers)
5. Optionally drop a Canva-designed banner into `Newsletter Banners/Newsletter Banners/<edition>.png` and run `node scripts/map-newsletter-banners.mjs` (auto-converts to WebP)
6. Commit the changes

---

## meta.json

Site-wide URLs that get referenced from the contact section, footer, and SEO tags.

```jsonc
{
  "siteTitle": "Gyanesh Samanta — Product Manager",
  "siteDescription": "Product Manager, …",
  "ogImage": "/images/brand/og-cover.jpg",
  "canonicalUrl": "https://gyane.sh",
  "linkedinUrl": "https://linkedin.com/in/gyanesh-samanta",
  "githubUrl": "https://github.com/GyaneshSamanta",
  "email": "mail.gyaneshsamanta@gmail.com",
  "calBookingUrl": "https://cal.com/gyaneshsamanta",
  "youtubeUrl": "https://youtube.com/@gyanesh",
  "newsletterUrl": "https://www.linkedin.com/newsletters/…",
  "phone": "(91) …"
}
```

---

## Image assets

### Headshot

Drop a square or 4:5 portrait JPG at `public/images/hero/headshot.jpg`. The hero
applies a soft radial mask so the photo dissolves into the page — high-contrast
backgrounds work best (don't worry about cutout).

### Company logos

Each milestone in `data/journey.json` references a logo via the `logo` field.
Logos render inside a small white `rounded-xl` chip at 40×40 (polaroid) and 56×56
(modal).

- **Format:** PNG or SVG with transparent background, or JPEG with white background
- **Aspect:** square works best
- **Size:** ~128×128 is fine; the chip downscales
- **Naming:** `public/images/logos/<slug>.{jpeg,png,svg}` where `<slug>` is the
  basename in `data/journey.json` `logo`

### Recommender headshots

- **Path:** `public/images/recommendations/<slug>.{jpeg,png}`
- **Slug:** matches `data/recommendations.json` `slug` field
- **Fallback:** if file missing, card renders a gradient-initials avatar

### Blog covers

Three layers of fallback, in priority order:

1. **Canva-designed banner** at `public/images/blog/<slug>/cover.webp` (preferred)
2. **Auto-generated branded SVG** at `public/images/blog/<slug>/cover.svg`
3. **Gradient placeholder** (no image at all)

To replace a generated SVG with a real banner:
- Drop the PNG into `Newsletter Banners/Newsletter Banners/`
- Re-run `node scripts/map-newsletter-banners.mjs`

---

## Updating dynamic feeds

These don't live in `data/` — they're fetched live from GitHub and YouTube.

### GitHub commits + repos (Now Shipping section)

No action needed. The site fetches `/users/<USERNAME>/events/public` every 5
minutes via Next.js ISR. **Just commit somewhere on GitHub and the live feed
will surface it within minutes.**

USERNAME is hardcoded in `components/sections/now-shipping.tsx` and
`components/sections/hero.tsx` — change once if you rebrand.

### GitHub snake chart

The animated SVG comes from `https://raw.githubusercontent.com/GyaneshSamanta/GyaneshSamanta/output/github-contribution-grid-snake-dark.svg`.
This requires the [Platane/snk](https://github.com/Platane/snk) GitHub Action
running daily on your profile README repo (`GyaneshSamanta/GyaneshSamanta`).

If the snake breaks, check that the action is still running in that repo's Actions tab.

### YouTube podcast + shorts

The site scrapes `https://www.youtube.com/playlist?list=<PLAYLIST_ID>` server-side
every 6 hours. **PLAYLIST_ID is hardcoded** in `components/sections/podcast.tsx` —
change it if you move to a new playlist.

Videos with duration ≤ 90s are auto-classified as Shorts and routed to the
iPhone frame.

---

## What NOT to edit

- `next.config.mjs` (redirects, CSP, image domains)
- `tailwind.config.ts` (design tokens — modifying breaks the brand)
- `app/globals.css` (CSS variables and article-prose typography)
- `tsconfig.json`, `package.json` (unless adding a dependency)

If you need to add a section, copy an existing one from `components/sections/`,
register it in `app/page.tsx`, and add the data file (if needed) to `data/`.
