# Gyanesh Samanta — Portfolio Website

> Personal portfolio website built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**

---

## ✨ Features

- **Sticky-Stack Scroll** — Sections stack on top of each other as you scroll, creating a card-like browsing experience
- **Loading Screen** — Animated intro with rotating digits and loading counter
- **Two-State Navbar** — Expanded on home, compact & blurred on scroll
- **Alternating Themes** — Dark/light sections with smooth transitions
- **Recommendation Marquee** — Auto-scrolling testimonials that pause on hover with expandable cards
- **Gradient Design System** — Custom palette: `#982598` · `#15173D` · `#E491C9` · `#F1E9E9`
- **Section Navigation** — Right-side dot indicators with labels on hover
- **Cal.com Integration** — Embedded booking widget
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

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── globals.css      # Brand palette & theme system
│   ├── layout.tsx       # Root layout with Cal.com embed
│   └── page.tsx         # Homepage with all sections
├── components/
│   ├── navbar.tsx        # Two-state navigation
│   ├── footer.tsx        # LinkedIn, GitHub, Email
│   ├── section-nav.tsx   # Right-side dot navigation
│   ├── sections/         # Hero, Journey, Research, Projects, Writing, Recommendations
│   └── ui/               # Loading screen, cursor, audio toggle
├── data/                # Content JSON (experience, projects, research)
├── lib/                 # Constants & utilities
└── public/images/       # Static assets
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

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
