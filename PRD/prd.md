# PRD: Wiki-Driven CMS + Design Overhaul
## Portfolio Website — GyaneshSamanta/Portfolio-Website
**Version:** 3.0.0  
**Author:** Gyanesh Samanta  
**Status:** Ready for Implementation  

---

## ⚠️ AGENT INSTRUCTIONS (Read Before Executing)

You are implementing a refactor, NOT a rebuild. The golden rule is:

> **Zero component surgery unless explicitly listed in this PRD. You are changing the data plumbing and adding targeted enhancements. If a change isn't in this document, don't make it.**

**Execution order is strict.** Do not skip steps. Do not batch steps that depend on each other. After each major step, verify the dev server runs without errors before proceeding.

**On ambiguity:** Halt and ask. Do not assume. A wrong assumption in Step 2 will cascade into all subsequent steps.

---

## 1. Executive Summary

The portfolio website currently hard-codes all content in JSON files under `data/`. Updating a single line of text (e.g., a job title, a testimonial) requires a developer to locate the correct JSON, edit it, commit, and redeploy. This PRD specifies a "Ghost Sync" architecture: a single `wiki.md` file becomes the **one source of truth** for all human-readable content, images, and links. A build-time parser script reads `wiki.md`, validates it, and writes output JSON files that the existing React components continue to consume without modification.

Additionally, this PRD specifies four targeted enhancements: recommendation avatars, exhaustive wiki coverage, performance optimization, and a set of high-value UX improvements identified through site analysis.

---

## 2. Goals & Non-Goals

### Goals
- ✅ A single `wiki.md` file controls 100% of visible text, images, links, and button labels
- ✅ Updating wiki.md → committing → Vercel auto-deploys → content is live (no code changes needed)
- ✅ If the parser fails, the site shows stale data, NOT a crash
- ✅ Recommendation cards display the recommender's avatar photo
- ✅ Site animation smoothness is measurably improved (targeting 60fps on mid-range hardware)
- ✅ Zero changes to existing component APIs or prop shapes

### Non-Goals
- ❌ A CMS UI / admin dashboard (out of scope)
- ❌ Real-time editing without redeployment
- ❌ Database or backend changes
- ❌ Redesigning existing sections (layout, color, typography stays unchanged)

---

## 3. Architecture: The Ghost Sync Pattern

```
wiki.md  ──►  scripts/sync-wiki.mjs  ──►  data/wiki_content.json
                     │                           │
              (runs at build time)      (read by existing components)
                     │
              (also writes to)  ──►  data/recommendations.json
                                     data/experience.json
                                     data/projects.json
                                     data/research.json
                                     data/writing.json
                                     data/hero.json
                                     data/meta.json
```

### 3.1 Key Architectural Decisions

**Decision 1: Single output vs. per-section outputs**  
The parser writes to **individual JSON files** (one per section) rather than one monolithic output JSON. Reason: components already import section-specific files. Changing import paths would require component surgery, violating our non-goal.

**Decision 2: Fail-safe behavior**  
If `wiki.md` is missing or malformed, the sync script logs a warning and exits with code 0 (non-blocking). The existing JSON files remain intact. The site builds with last-known-good data.

**Decision 3: Schema validation**  
The parser validates required fields before writing. If a required field is missing in `wiki.md`, it logs an error per field and skips updating that section's JSON only. Other sections continue to update normally.

---

## 4. File Structure Changes

The following files will be **created** (nothing existing is deleted):

```
scripts/
  sync-wiki.mjs          # Main parser + writer (ESM module)
  wiki-validator.mjs     # Schema validation helpers
public/
  images/
    recommendations/     # New folder — headshots for recommenders
wiki.md                  # NEW: single source of truth (root of repo)
```

The following files will be **modified**:

```
package.json             # "dev" and "build" scripts updated
data/recommendations.json  # Schema extended to include `photo` field
```

---

## 5. The `wiki.md` Schema Specification

This is the canonical schema. The parser is built to this spec. Every field listed here is parseable. Fields marked `[REQUIRED]` will trigger a validation error if absent. Fields marked `[OPTIONAL]` will use a defined default if absent.

### 5.1 Schema Design Principles
- Section headers use `##` (H2). Sub-item headers use `###` (H3).
- Multi-value fields within a single item are delimited by ` | ` (space-pipe-space).
- Lists under a header use standard markdown `- ` bullets.
- Images are referenced as relative paths from repo root: `public/images/...`
- URLs are written as plain text (no markdown link syntax inside data fields).
- Dates follow `MMM YYYY` format (e.g., `Jun 2023`).
- A `<!-- SECTION_END -->` comment marks the end of each section to prevent parser bleed.

---

### COMPLETE `wiki.md` TEMPLATE (Spec + Example)

```markdown
<!--
  wiki.md — Single Source of Truth
  Portfolio Website: Gyanesh Samanta
  
  EDITING GUIDE:
  - Only edit content between section headers and SECTION_END comments.
  - Do NOT change the ## section headers or ### subsection structures.
  - Delimiter for multi-value fields: ` | ` (space, pipe, space)
  - Image paths are relative to repo root: public/images/filename.ext
  - URLs are plain text, no brackets
-->

# WIKI — GYANESH SAMANTA PORTFOLIO

---

## META
- site_title: Gyanesh Samanta — Product Manager
- site_description: PM at the intersection of Data, AI, Data Storytelling and Consumer Behaviour
- og_image: public/images/og-cover.jpg
- favicon: public/images/favicon.ico
- canonical_url: https://gyaneshsamana.vercel.app
- twitter_handle: @GyaneshSamanta
- linkedin_url: https://linkedin.com/in/gyaneshsamanta
- github_url: https://github.com/GyaneshSamanta
- email: your@email.com
- topmate_url: https://topmate.io/gyaneshsamanta
- cal_booking_url: https://cal.com/gyaneshsamanta

<!-- SECTION_END -->

---

## HERO
- headline: PM at the intersection of
- headline_highlight: Data, AI & Consumer Behaviour
- subheadline: Building products that turn raw data into decisions. Currently joining IBM in June 2026.
- cta_primary_label: Book a Call
- cta_primary_url: https://cal.com/gyaneshsamanta
- cta_secondary_label: Read my Newsletter
- cta_secondary_url: https://linkedin.com/newsletters/gyanesh-on-product
- hero_image: public/images/hero-photo.jpg
- hero_image_alt: Gyanesh Samanta — Product Manager
- badge_1: 20+ Hackathon Wins
- badge_2: 3 Published Papers
- badge_3: 1,200 Newsletter Subscribers
- scroll_cta_label: Scroll to explore

<!-- SECTION_END -->

---

## NAVBAR
- logo_text: GS
- logo_image: public/images/logo.svg
- nav_link_1_label: Journey
- nav_link_1_href: #journey
- nav_link_2_label: Research
- nav_link_2_href: #research
- nav_link_3_label: Projects
- nav_link_3_href: #projects
- nav_link_4_label: Writing
- nav_link_4_href: #writing
- nav_link_5_label: Recommendations
- nav_link_5_href: #recommendations
- cta_label: Let's Talk
- cta_href: #contact

<!-- SECTION_END -->

---

## EXPERIENCE

### IBM | Associate — Data & AI | Jun 2026 - Present
- type: full_time
- logo: public/images/logos/ibm.png
- location: India
- description: Joining the Data & AI practice.
- tag_1: Data Strategy
- tag_2: AI Products
- tag_3: B2B

### helloPM | Product Researcher (Intern) | Jan 2026 - Jun 2026
- type: internship
- logo: public/images/logos/hellopm.png
- location: Remote
- description: Conducting product research to shape PM education curriculum and tooling.
- tag_1: Product Research
- tag_2: PM Education
- tag_3: Frameworks

### Snapdeal | Product Manager | Jul 2024 - Nov 2024
- type: full_time
- logo: public/images/logos/snapdeal.png
- location: Delhi, India
- description: Led VIP loyalty programme (Snapdeal Gold). Owned Mixpanel implementation across checkout funnel. Drove retention improvements through behavioural cohort analysis.
- tag_1: Loyalty
- tag_2: Analytics
- tag_3: Retention
- tag_4: Mixpanel

### Wall.app | Data Scientist → Product Manager | Jun 2022 - Jun 2023
- type: full_time
- logo: public/images/logos/wall.png
- location: Remote
- description: Self-transitioned from DS to PM in a blockchain startup. Defined roadmap for data features.
- tag_1: Web3
- tag_2: Data Science
- tag_3: Product

### Tealfeed | Data Scientist | Dec 2021 - May 2022
- type: full_time
- logo: public/images/logos/tealfeed.png
- location: Remote
- description: Built recommendation engine and content performance dashboards.
- tag_1: Recommendations
- tag_2: NLP
- tag_3: Python

### iSchoolConnect | ML Engineer | Jun 2021 - Nov 2021
- type: full_time
- logo: public/images/logos/ischool.png
- location: Remote
- description: Engineered ML pipelines for student-university matching.
- tag_1: ML Engineering
- tag_2: Matching Algorithms

<!-- SECTION_END -->

---

## EDUCATION

### Xavier Institute of Management Bhubaneswar (XIMB) | PGDM (MBA) | 2023 - 2025
- logo: public/images/logos/ximb.png
- location: Bhubaneswar, India
- description: Specialisation in Business Analytics. Core focus on Product Management, Data-driven Strategy, and Consumer Behaviour.
- achievement_1: Best Research Paper — 2024

### [Your Undergrad University] | B.Tech — Computer Science | 2017 - 2021
- logo: public/images/logos/undergrad.png
- location: India
- description: Foundation in Data Structures, Algorithms, and Machine Learning.

<!-- SECTION_END -->

---

## RESEARCH

### Conversational AI as Decision Infrastructure for B2B Product Teams | 2025
- co_authors: Sameer Kulkarni
- journal: [Journal Name]
- status: Published
- abstract: Explores how conversational AI agents can replace static dashboards in product decision workflows.
- link: https://doi.org/xxx
- tag_1: Conversational AI
- tag_2: B2B Product
- tag_3: Decision Systems

### B2B SaaS Usability and Feature Adoption — A Quantitative Study | 2024
- co_authors: [Co-author Name]
- journal: [Journal Name]
- status: Published
- abstract: Statistical analysis of usability (SUS scores) and its correlation with feature adoption curves and NPS across mid-market SaaS tools.
- link: https://doi.org/xxx
- tag_1: SaaS
- tag_2: UX Research
- tag_3: Statistics

### [Paper Title 3] | 2024
- co_authors: [Names]
- journal: [Journal Name]
- status: Published
- abstract: [Abstract text]
- link: https://doi.org/xxx
- tag_1: [Tag]

<!-- SECTION_END -->

---

## PROJECTS

### Cue — Developer Environment CLI | 2025
- tagline: Zero-dependency Go CLI for streamlining dev environment setup
- status: Active
- tech_stack: Go | Cobra | Bubbletea | SQLite | goreleaser
- github_url: https://github.com/GyaneshSamanta/cue
- live_url: 
- cover_image: public/images/projects/cue-cover.png
- cover_image_alt: Cue CLI tool screenshot
- description: Queues package manager lock conflicts, pauses/resumes on network loss, provides semantic macro shortcuts, provisions developer environment stacks, and integrates Claude Code with local Ollama via LiteLLM proxy.
- tag_1: CLI
- tag_2: Go
- tag_3: Developer Tools
- tag_4: AI Integration
- featured: true

### Portfolio Website | 2026
- tagline: Personal portfolio built in public with Next.js 14
- status: Active
- tech_stack: Next.js 14 | Tailwind CSS | Framer Motion | TypeScript
- github_url: https://github.com/GyaneshSamanta/Portfolio-Website
- live_url: https://gyaneshsamanta.vercel.app
- cover_image: public/images/projects/portfolio-cover.png
- cover_image_alt: Portfolio website screenshot
- description: Sticky-stack scroll, animated loading screen, two-state navbar, recommendation marquee, and Cal.com booking integration.
- tag_1: Next.js
- tag_2: TypeScript
- tag_3: Design Systems
- featured: true

<!-- SECTION_END -->

---

## WRITING

### Issue #14 — Conversational AI is the Next Frontier for Product Decisions | 2025
- publication: Gyanesh on Product (LinkedIn Newsletter)
- co_author: Sameer Kulkarni
- url: https://linkedin.com/newsletters/xxx
- cover_image: public/images/writing/issue-14.jpg
- description: Co-authored with Sameer Kulkarni (Founder, Navaantrix / Tatva AI). Argues that conversational AI agents will replace static dashboards as the primary interface for product decision-making.
- read_time: 8 min read
- tag_1: Conversational AI
- tag_2: Product Management
- featured: true

### Issue #13 — Inventory-Blind Advertising in Meta & Google Ad Pipelines | 2025
- publication: Gyanesh on Product (LinkedIn Newsletter)
- co_author: 
- url: https://linkedin.com/newsletters/xxx
- cover_image: public/images/writing/issue-13.jpg
- description: Why Meta and Google ad systems fail to account for live inventory states, and how to build intent-aware pipelines that don't waste budget on out-of-stock SKUs.
- read_time: 6 min read
- tag_1: Advertising
- tag_2: Data Engineering
- featured: true

<!-- SECTION_END -->

---

## RECOMMENDATIONS

### Recommender 1 Name | Job Title | Company | Relationship
- photo: public/images/recommendations/recommender1.jpg
- photo_alt: [Recommender 1 Name] headshot
- linkedin_url: https://linkedin.com/in/xxx
- short_quote: One-line summary shown in marquee card (max 120 chars)
- full_text: Full recommendation text shown when card is expanded. Can be multiple sentences. Be thorough here as this is what recruiters read carefully.
- date: Jan 2026

### Recommender 2 Name | Job Title | Company | Relationship
- photo: public/images/recommendations/recommender2.jpg
- photo_alt: [Recommender 2 Name] headshot
- linkedin_url: https://linkedin.com/in/xxx
- short_quote: One-line summary shown in marquee card (max 120 chars)
- full_text: Full recommendation text.
- date: Dec 2025

<!-- SECTION_END -->

---

## HACKATHONS

### ETHIndia 2023 | Winner | Ethereum Foundation | Nov 2023
- prize: 1st Place
- project_name: [Project Name]
- project_description: [What you built]
- team_size: 3
- tech_stack: Solidity | React | Node.js
- devpost_url: https://devpost.com/xxx
- logo: public/images/hackathons/ethindia.png

### ETHIndia 2021 | Winner | Ethereum Foundation | Nov 2021
- prize: 1st Place
- project_name: [Project Name]
- project_description: [What you built]
- team_size: 2
- tech_stack: Solidity | Web3.js
- devpost_url: https://devpost.com/xxx
- logo: public/images/hackathons/ethindia.png

<!-- SECTION_END -->

---

## SKILLS

### Data & Analytics
- skill_1: Product Analytics (Mixpanel, Amplitude)
- skill_2: SQL & Python (Pandas, Scikit-learn)
- skill_3: Data Storytelling & Visualisation
- skill_4: A/B Testing & Experimentation

### AI & Machine Learning
- skill_1: LLM Integration (Claude, Ollama, LiteLLM)
- skill_2: ML Engineering (scikit-learn, TensorFlow)
- skill_3: NLP & Recommendation Systems
- skill_4: Agentic Workflow Design

### Product Management
- skill_1: Roadmapping & Prioritisation (RICE, ICE)
- skill_2: User Research & Behavioural Analysis
- skill_3: B2B SaaS Product Strategy
- skill_4: Go-to-Market Planning

### Engineering
- skill_1: Go (CLI tools, Cobra, Bubbletea)
- skill_2: TypeScript / Next.js
- skill_3: Blockchain / Solidity
- skill_4: Git & CI/CD

<!-- SECTION_END -->

---

## CONTACT
- section_headline: Let's build something interesting.
- section_subheadline: Open to senior PM roles, research collaborations, and advisory conversations.
- cta_book_label: Book a 30-min Call
- cta_book_url: https://cal.com/gyaneshsamanta
- cta_topmate_label: Mentorship on Topmate
- cta_topmate_url: https://topmate.io/gyaneshsamanta
- cta_newsletter_label: Subscribe to Newsletter
- cta_newsletter_url: https://linkedin.com/newsletters/gyanesh-on-product

<!-- SECTION_END -->

---

## FOOTER
- footer_tagline: Built in public. Thinking out loud.
- copyright_text: © 2026 Gyanesh Samanta. All rights reserved.
- footer_link_1_label: GitHub
- footer_link_1_url: https://github.com/GyaneshSamanta
- footer_link_2_label: LinkedIn
- footer_link_2_url: https://linkedin.com/in/gyaneshsamanta
- footer_link_3_label: Newsletter
- footer_link_3_url: https://linkedin.com/newsletters/gyanesh-on-product
- footer_link_4_label: Topmate
- footer_link_4_url: https://topmate.io/gyaneshsamanta

<!-- SECTION_END -->

---

## SECTION_NAV_LABELS
- dot_1_label: Home
- dot_2_label: Journey
- dot_3_label: Research
- dot_4_label: Projects
- dot_5_label: Writing
- dot_6_label: Recommendations
- dot_7_label: Contact

<!-- SECTION_END -->

---

## LOADING_SCREEN
- loading_text: Loading...
- loading_tagline: Good things take a moment.

<!-- SECTION_END -->
```

---

## 6. The Parser Script Specification (`scripts/sync-wiki.mjs`)

The agent must implement the parser to this exact specification. No shortcuts.

### 6.1 Parsing Algorithm

```
1. Read wiki.md as UTF-8 string
2. Split on `\n## ` to extract top-level sections
3. For each section:
   a. Extract section name (first line, trimmed)
   b. Remove everything after `<!-- SECTION_END -->` in that block
   c. Route to section-specific parser function based on name
4. Each section parser returns a typed JavaScript object / array
5. Validate required fields per section (see Section 6.2)
6. Write validated output to the appropriate JSON file in /data/
7. Log a summary: sections updated, sections skipped, warnings
```

### 6.2 Section → JSON File Mapping

| wiki.md Section    | Output JSON File              | Parser Function         |
|--------------------|-------------------------------|-------------------------|
| META               | `data/meta.json`              | `parseMeta()`           |
| HERO               | `data/hero.json`              | `parseHero()`           |
| NAVBAR             | `data/navbar.json`            | `parseNavbar()`         |
| EXPERIENCE         | `data/experience.json`        | `parseExperience()`     |
| EDUCATION          | `data/education.json`         | `parseEducation()`      |
| RESEARCH           | `data/research.json`          | `parseResearch()`       |
| PROJECTS           | `data/projects.json`          | `parseProjects()`       |
| WRITING            | `data/writing.json`           | `parseWriting()`        |
| RECOMMENDATIONS    | `data/recommendations.json`   | `parseRecommendations()`|
| HACKATHONS         | `data/hackathons.json`        | `parseHackathons()`     |
| SKILLS             | `data/skills.json`            | `parseSkills()`         |
| CONTACT            | `data/contact.json`           | `parseContact()`        |
| FOOTER             | `data/footer.json`            | `parseFooter()`         |
| SECTION_NAV_LABELS | `data/section-nav.json`       | `parseSectionNav()`     |
| LOADING_SCREEN     | `data/loading.json`           | `parseLoading()`        |

### 6.3 Key-Value Parser (used by all flat sections)

```javascript
// Parses lines like: `- key: value`
function parseKeyValue(block) {
  const result = {};
  const lines = block.split('\n').filter(l => l.trim().startsWith('- '));
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(2, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    result[key] = value;
  }
  return result;
}
```

### 6.4 Subsection Parser (used by multi-item sections: EXPERIENCE, RESEARCH, etc.)

```javascript
// Splits on `### ` to get individual items
function parseSubsections(block) {
  const items = block.split('\n### ').slice(1); // skip content before first ###
  return items.map(item => {
    const lines = item.split('\n');
    const header = lines[0].trim(); // e.g. "IBM | Associate — Data & AI | Jun 2026 - Present"
    const parts = header.split(' | ').map(p => p.trim());
    const kvBlock = lines.slice(1).join('\n');
    return { _header: parts, ...parseKeyValue(kvBlock) };
  });
}
```

### 6.5 EXPERIENCE JSON Output Shape

Each experience item must conform to this shape (match what the Journey component expects):

```json
{
  "company": "IBM",
  "role": "Associate — Data & AI",
  "dateRange": "Jun 2026 - Present",
  "type": "full_time",
  "logo": "/images/logos/ibm.png",
  "location": "India",
  "description": "...",
  "tags": ["Data Strategy", "AI Products", "B2B"]
}
```

Note: `logo` paths are stored in wiki.md as `public/images/...` but written to JSON as `/images/...` (strip the `public` prefix, as Next.js serves from public root).

### 6.6 RECOMMENDATIONS JSON Output Shape

```json
{
  "name": "Recommender Name",
  "title": "Job Title",
  "company": "Company",
  "relationship": "Relationship",
  "photo": "/images/recommendations/recommender1.jpg",
  "photoAlt": "Recommender Name headshot",
  "linkedinUrl": "https://linkedin.com/in/xxx",
  "shortQuote": "...",
  "fullText": "...",
  "date": "Jan 2026"
}
```

### 6.7 Required Fields Validation

```javascript
const REQUIRED_FIELDS = {
  META: ['site_title', 'site_description', 'canonical_url'],
  HERO: ['headline', 'subheadline', 'cta_primary_label'],
  EXPERIENCE_ITEM: ['description'], // header parts are always required
  RESEARCH_ITEM: ['abstract', 'status'],
  PROJECTS_ITEM: ['tagline', 'github_url'],
  RECOMMENDATIONS_ITEM: ['short_quote', 'full_text', 'photo'],
};
```

---

## 7. Build Integration

### 7.1 `package.json` Changes

```json
{
  "scripts": {
    "sync": "node scripts/sync-wiki.mjs",
    "dev": "node scripts/sync-wiki.mjs && next dev",
    "build": "node scripts/sync-wiki.mjs && next build",
    "postinstall": "node scripts/sync-wiki.mjs"
  }
}
```

The `postinstall` hook ensures that fresh installs (e.g., on Vercel) also run the sync before building. This is the critical step for Vercel deployment to work.

### 7.2 Vercel Build Command

No changes needed to vercel.json. Vercel runs `npm run build` which now includes the sync step.

---

## 8. Design Change #1 — Recommendation Avatar Photos

### 8.1 Current State
The `components/sections/recommendations.tsx` renders cards with name, title, company, and quote. No photo.

### 8.2 Target State
Each recommendation card displays a circular avatar of the recommender. Photo is sourced from `public/images/recommendations/[filename].jpg`. Filename is defined in `wiki.md`.

### 8.3 Implementation Spec

**New folder:** `public/images/recommendations/` (create if absent)

**Component change (recommendations.tsx):**  
Add an `<Image>` element inside the card header. The `photo` field is now available on each recommendation object from the updated JSON.

```tsx
// In the card header area, BEFORE the name/title block:
{recommendation.photo && (
  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#982598]/30">
    <Image
      src={recommendation.photo}
      alt={recommendation.photoAlt || recommendation.name}
      fill
      className="object-cover"
      sizes="40px"
    />
  </div>
)}
```

**Fallback behavior:** If `photo` is empty/null, render a monogram avatar (first letter of name) in a `div` with brand gradient background. Never render a broken image.

```tsx
// Fallback monogram
<div className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-[#982598]/30 
                bg-gradient-to-br from-[#982598] to-[#15173D] 
                flex items-center justify-center text-white text-sm font-semibold">
  {recommendation.name.charAt(0)}
</div>
```

---

## 9. Design Change #2 — wiki.md Exhaustiveness

Already addressed in Section 5. The wiki.md template covers every section currently in the site. The agent must ensure:
- Every string currently hardcoded in any component is traced back to a key in wiki.md
- A pre-implementation audit: grep the codebase for hardcoded strings, cross-reference with the wiki template, add any missing keys before writing the parser

**Audit command to run before implementation:**
```bash
grep -rn '"[A-Z][a-z]' components/ app/ --include="*.tsx" --include="*.ts" | grep -v "className\|import\|type\|interface"
```

---

## 10. Design Change #3 — Performance Optimization

### 10.1 Root Cause Analysis

The site uses Framer Motion's `useScroll` + `useTransform` for the sticky-stack scroll effect. This creates a JavaScript scroll listener that fires on every scroll event, triggering React re-renders and style recalculations. On mid-range hardware this manifests as dropped frames and jank.

**Confirm before patching:**
```bash
# Check which components import useScroll
grep -rn "useScroll\|useTransform\|useSpring" components/ --include="*.tsx"
```

### 10.2 Optimization Strategy (in priority order)

**Tier 1 — CSS Hints (Non-breaking, implement first)**

Add `will-change: transform` to the outermost animated container in each sticky section. This tells the GPU to composite the layer ahead of time.

```css
/* In globals.css, add to sticky section containers */
.sticky-section {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer creation */
  backface-visibility: hidden;
}
```

**Tier 2 — Motion Values Optimization**

Replace `useTransform` chains with `useMotionValueEvent` for logging / side effects. Use `motionValue.set()` directly in scroll callbacks instead of derived transforms where possible.

For each `useScroll` + `useTransform` pairing in the sticky stack:
```tsx
// BEFORE (causes re-renders)
const { scrollYProgress } = useScroll({ target: ref });
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

// AFTER (no re-renders, runs in compositor thread)
const { scrollYProgress } = useScroll({ target: ref, layoutEffect: false });
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
// Add layoutEffect: false to prevent SSR mismatch warnings and reduce blocking
```

**Tier 3 — Viewport-Gated Animation**

Wrap sections below the fold in a `LazyMotion` component with `domAnimation` feature subset. This reduces Framer Motion's bundle contribution for non-critical sections.

```tsx
// In page.tsx or layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion';

// Wrap sections that are NOT the hero:
<LazyMotion features={domAnimation} strict>
  <JourneySection />
  <ResearchSection />
  {/* ... */}
</LazyMotion>
```

**Tier 4 — Intersection Observer Gate**

For sections below the fold, use `IntersectionObserver` to pause Framer Motion animations until the section is in view. This prevents off-screen scroll calculations.

```tsx
// In each section component
const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

// Only animate when in view
<motion.div
  ref={ref}
  animate={inView ? "visible" : "hidden"}
  variants={sectionVariants}
>
```

Add `react-intersection-observer` to dependencies (lightweight, ~1KB).

**Tier 5 — Reduced Motion Respect**

```tsx
import { useReducedMotion } from 'framer-motion';

function SectionWrapper({ children, animationProps }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div {...(prefersReduced ? {} : animationProps)}>
      {children}
    </motion.div>
  );
}
```

### 10.3 Image Optimization

Audit all `<img>` tags and replace with Next.js `<Image>` where not already done. Add explicit `width`, `height`, and `priority` to hero image. This eliminates Cumulative Layout Shift (CLS).

```tsx
// Hero image
<Image
  src={hero.hero_image}
  alt={hero.hero_image_alt}
  width={400}
  height={500}
  priority={true}  // LCP element — preload it
  className="..."
/>
```

### 10.4 Font Loading

If custom fonts are loaded via `@font-face` in CSS, ensure `font-display: swap` is set to prevent render-blocking.

---

## 11. Design Change #4 — AI-Identified UX Improvements

The following improvements were identified through site analysis. Each has an effort estimate and priority score. Gyanesh to review, annotate with Go/No-Go, and the agent implements only approved items.

> **Instructions for Gyanesh:** Add `[GO]` or `[NO-GO]` next to each item header before handing this PRD to Opus.

---

### 11.1 [REVIEW] Open Graph / Social Preview Cards [GO]
**Problem:** When the portfolio link is shared on LinkedIn, Twitter, or in Slack, it shows a generic preview with no image or context. This is a missed brand impression opportunity — especially critical for a PM whose network shares his work.  
**Solution:** Implement `next/og` to generate dynamic OG images per page. Include name, tagline, and a branded gradient background.  
**Files:** `app/opengraph-image.tsx` (new), `app/layout.tsx` (meta tags)  
**Effort:** 2 hours | **Priority:** HIGH (brand visibility)

---

### 11.2 [REVIEW] Hackathon Trophy Wall [GO]
**Problem:** The site lists hackathon wins in experience context, but 20+ national wins is a standout credential that deserves its own visual treatment. Recruiters and collaborators scanning the site miss this signal.  
**Solution:** Add a "Hackathon Wall" subsection in the Journey or Projects section. Render hackathon logos in a masonry/grid layout with win count badge. Data from `wiki.md HACKATHONS` section (already specced above).  
**Files:** `components/sections/hackathons.tsx` (new), `app/page.tsx` (add section)  
**Effort:** 3 hours | **Priority:** MEDIUM

---

### 11.3 [REVIEW] Dynamic Stats Bar in Hero [GO]
**Problem:** Stats (20+ wins, 3 papers, 1200 subscribers) are listed as static badges but have no visual weight.  
**Solution:** Add a subtle animated counter that counts up when the hero section first comes into view. Numbers animate from 0 to final value over 1.5s with ease-out. Sourced from `wiki.md HERO` badges.  
**Files:** `components/sections/hero.tsx`, `hooks/useCountUp.ts` (new)  
**Effort:** 1.5 hours | **Priority:** MEDIUM (first impression improvement)

---

### 11.4 [REVIEW] Keyboard Navigation & Focus Management [NO-GO]
**Problem:** The dot-based section navigation (`components/section-nav.tsx`) is not keyboard-accessible. Tab order may jump unexpectedly across the sticky-stack. This is an accessibility gap and also affects users who navigate with keyboard (common among developers, the target audience).  
**Solution:** Add `role="navigation"`, `aria-label="Page sections"`, keyboard event handlers (`ArrowUp`/`ArrowDown`) to `section-nav.tsx`. Ensure each dot is a `<button>` with descriptive `aria-label`.  
**Files:** `components/section-nav.tsx`  
**Effort:** 1 hour | **Priority:** HIGH (accessibility + developer audience)

---

### 11.5 [REVIEW] Reading Time on Writing Cards [GO]
**Problem:** Writing cards don't show read time, which is a strong engagement signal. Users don't click without knowing the time investment.  
**Solution:** Read time is already defined in `wiki.md WRITING` as `read_time`. Display it as a badge on each writing card.  
**Files:** `components/sections/writing.tsx`  
**Effort:** 30 min | **Priority:** LOW-MEDIUM (quick win)

---

### 11.6 [REVIEW] Newsletter Subscriber Count Live Badge [GO]
**Problem:** "1,200 subscribers" is hardcoded in hero copy. It will become stale. A stale number looks worse than no number.  
**Solution:** Option A (simple): Keep it in `wiki.md` and update manually — at least the update path is clear. Option B (advanced): Use LinkedIn newsletter API or Beehiiv/Substack API to fetch live count at build time and cache it in a JSON file.  
**Recommendation:** Implement Option A now (it's already in the wiki schema). Document Option B as a future enhancement in comments.  
**Effort:** Already handled | **Priority:** N/A for now

---

### 11.7 [REVIEW] Project Filter Tags [GO]
**Problem:** Projects section shows all projects without filtering. As the list grows, users (especially recruiters scanning for specific skills) can't quickly find relevant work.  
**Solution:** Add a tag-based filter bar above the projects grid. Tags are extracted from project data. Clicking a tag filters the visible cards with a smooth fade transition. No state management library needed — local `useState` is sufficient.  
**Files:** `components/sections/projects.tsx`  
**Effort:** 2 hours | **Priority:** MEDIUM

---

### 11.8 [REVIEW] Cal.com Booking — Lazy Load [GO]
**Problem:** The Cal.com embed is likely loaded eagerly, adding JS weight to initial page load even if the user never reaches the booking section.  
**Solution:** Use `next/dynamic` with `ssr: false` for the Cal.com component. Add an `IntersectionObserver` to trigger load only when the contact section enters the viewport.  
**Files:** `app/layout.tsx` or wherever Cal.com is embedded  
**Effort:** 1 hour | **Priority:** HIGH (direct impact on Core Web Vitals / LCP)

---

## 12. Execution Checklist for Opus

The agent must execute in this exact order. Check off each item only after verifying no TypeScript errors and the dev server runs successfully.

```
[ ] Step 0: Read this entire PRD before writing a single line of code.

[ ] Step 1: Audit
    - Run grep command from Section 9.2 to find all hardcoded strings
    - List any content keys NOT in the wiki.md template
    - Get approval before proceeding

[ ] Step 2: Create wiki.md in repo root
    - Use the exact template from Section 5
    - Populate with current content from existing JSON files

[ ] Step 3: Create scripts/wiki-validator.mjs
    - Implement validation per Section 6.7

[ ] Step 4: Create scripts/sync-wiki.mjs
    - Implement all parser functions per Section 6
    - Test standalone: `node scripts/sync-wiki.mjs`
    - Verify output JSON files match current JSON files structurally

[ ] Step 5: Update package.json scripts per Section 7.1

[ ] Step 6: Create public/images/recommendations/ folder
    - Add .gitkeep placeholder

[ ] Step 7: Update data/recommendations.json schema
    - Add `photo` and `photoAlt` fields with empty string defaults

[ ] Step 8: Update recommendations component (Section 8.3)
    - Implement avatar with fallback monogram

[ ] Step 9: Performance optimizations
    - Implement Tier 1 (CSS) — test
    - Implement Tier 2 (layoutEffect) — test
    - Implement Tier 3 (LazyMotion) — test
    - Implement Tier 4 (IntersectionObserver) — test
    - Implement Tier 5 (useReducedMotion) — test
    - Image optimization audit

[ ] Step 10: Implement approved items from Section 11
    (Only items marked [GO] by Gyanesh)

[ ] Step 11: Final build test
    - npm run build — must complete with 0 errors
    - Check all data JSON files are present and valid JSON
    - Run lighthouse on localhost build, document score

[ ] Step 12: Update README.md
    - Add "Editing Content" section explaining wiki.md workflow
    - Document the image folder structure for recommendations
```

---

## 13. Testing Acceptance Criteria

| Test | Pass Condition |
|------|----------------|
| Wiki sync | Running `node scripts/sync-wiki.mjs` produces valid JSON in all data/ files |
| Fail-safe | Deleting wiki.md and running sync — site builds with stale data, no crash |
| Malformed field | Adding a bad line to wiki.md — that section skips, others update |
| Recommendation photo | Photo renders correctly; falls back to monogram if photo field is empty |
| Performance | Chrome DevTools Performance tab shows no long tasks (>50ms) during scroll |
| Build | `npm run build` exits 0 on clean install |
| Vercel | Pushing to main triggers successful Vercel deploy with updated content |
| Keyboard nav | Tab through section-nav with keyboard, each dot is reachable and activatable |

---

## 14. Out of Scope (Do Not Implement)

- Multi-language / i18n support
- CMS admin UI
- Database or backend API
- Authentication
- Dark mode toggle (site already has alternating section themes)
- Any changes to the brand color palette
- Restructuring the section order

---

## 15. Appendix: Useful Commands

```bash
# Run parser standalone
node scripts/sync-wiki.mjs

# Check for hardcoded strings in components
grep -rn '"[A-Z][a-z]' components/ app/ --include="*.tsx"

# Validate JSON output
cat data/experience.json | python3 -m json.tool > /dev/null && echo "Valid JSON"

# Check which files import Framer Motion scroll hooks
grep -rn "useScroll\|useTransform\|useSpring" components/ --include="*.tsx"

# Check bundle size impact
npx @next/bundle-analyzer
```

---

*PRD Version 1.0.0 — Gyanesh Samanta Portfolio Website*  
*Ready for implementation*