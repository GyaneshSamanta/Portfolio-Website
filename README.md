# Gyanesh Samanta — Portfolio Website

> Built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion** · Palette: `#982598` `#15173D` `#E491C9` `#F1E9E9`

---

## 🚀 Host for Free on Vercel (Recommended)

### Step 1: Push to GitHub
Your code is already on GitHub at `GyaneshSamanta/Portfolio-Website`. If you've made local changes, commit and push:

```bash
git add -A
git commit -m "Final polish: design overhaul, security headers, mobile optimization"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New… → Project"**
2. **Import** your `GyaneshSamanta/Portfolio-Website` repo
3. Vercel auto-detects Next.js — leave all settings as default
4. Click **"Deploy"** — done in ~60 seconds
5. You'll get a free URL like `portfolio-website-xyz.vercel.app`

### Step 3: Connect Custom Domain (Optional)
1. In Vercel Dashboard → **Settings → Domains**
2. Add your domain (e.g., `gyane.sh`)
3. Point your DNS to Vercel's nameservers (Vercel provides exact records)
4. SSL is automatic and free

---

## 🆓 Alternative Free Hosting Options

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** (recommended) | Auto deploys, free SSL, edge CDN, perfect Next.js support | — |
| **Netlify** | Similar to Vercel, good free tier | Slightly less optimal for Next.js SSR |
| **Cloudflare Pages** | Fast global CDN, free | Requires `@cloudflare/next-on-pages` adapter |
| **GitHub Pages** | Free, integrated with repo | Static export only (`next export`), no SSR |

---

## 🛠 Local Development

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

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── globals.css      # Brand palette & theme system
│   ├── layout.tsx       # Root layout, Cal.com embed
│   └── page.tsx         # Homepage sections
├── components/
│   ├── navbar.tsx        # Two-state nav (expanded/compact)
│   ├── footer.tsx        # LinkedIn, GitHub, Email
│   ├── section-nav.tsx   # Right-side dot navigation
│   ├── sections/         # Hero, Journey, Research, Projects, Writing, etc.
│   └── ui/               # Loading screen, cursor, audio toggle
├── data/                # Content JSON (experience, projects, research)
├── lib/                 # Constants, utilities
└── public/images/       # Headshot, newsletter cover
```

---

## 🔒 Security

Production security headers are configured in `next.config.mjs`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (restricts scripts/styles/frames to trusted sources)
- `Permissions-Policy` (disables camera/mic/geo)

---

## 📱 Mobile Optimizations

- Responsive hero layout switches to vertical stack
- Mobile hamburger menu with animated slide-in
- Touch-friendly card sizes and tap targets
- Recommendation cards readable at `350px` width on mobile
- Gradient fade edges optimized for smaller screens
