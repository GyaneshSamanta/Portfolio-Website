"use client";

/**
 * Journey — DESIGN.md §5.3 (rev v3.1 — sticky-both-panes card-swap)
 *
 * Both LEFT pane (walking visual) and RIGHT pane (single chapter card)
 * are STICKY inside a tall section. As the user scrolls through the section,
 * the figure ascends the path on the left, and the card on the right
 * crossfades through milestones — one card at a time, content morphs.
 *
 *   ┌──────────────────────┬──────────────────────┐
 *   │                      │                      │
 *   │   sticky walking     │   STICKY single      │
 *   │   visual + path      │   chapter card       │
 *   │                      │   (content swaps     │
 *   │   • Figure ascends   │    as user scrolls)  │
 *   │   • Path progress    │                      │
 *   │   • Chapter counter  │   ┌──────────────┐   │
 *   │                      │   │ 2019         │   │
 *   │                      │   │ SRM Univ.    │   │
 *   │                      │   │ B.Tech CS    │   │
 *   │                      │   └──────────────┘   │
 *   └──────────────────────┴──────────────────────┘
 *
 * Section height = N × 65vh — gives each chapter its own scroll zone.
 * AnimatePresence handles the card transitions.
 *
 * Mobile: same sticky model, just tighter widths.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MapPin, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import journeyData from "@/data/journey.json";
import { WalkingFigure } from "@/components/journey/walking-figure";

type Milestone = {
  id: string;
  year: string;
  type: "education" | "role" | "internship" | "milestone";
  org: string;
  title: string;
  dates: string;
  logo?: string;
  shipped: string;
  description?: string;
  location?: string;
  tags: string[];
  color: "purple" | "pink" | "violet" | "magenta";
  isFuture?: boolean;
};

const MILESTONES = journeyData as Milestone[];
const SCROLL_PER_CHAPTER = 65; // vh per chapter

const TYPE_LABEL: Record<Milestone["type"], string> = {
  education: "Education",
  role: "Full-time",
  internship: "Internship",
  milestone: "Milestone",
};

const COLOR_HALO: Record<Milestone["color"], string> = {
  purple: "from-brand-purple/40 to-transparent",
  pink: "from-brand-pink/40 to-transparent",
  violet: "from-brand-violet/40 to-transparent",
  magenta: "from-brand-magenta/40 to-transparent",
};

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Walking flag — stays on briefly after each scroll tick.
  useEffect(() => {
    let timer: number | undefined;
    const unsub = scrollYProgress.on("change", () => {
      setWalking(true);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setWalking(false), 800);
    });
    return () => {
      unsub();
      if (timer) window.clearTimeout(timer);
    };
  }, [scrollYProgress]);

  // Active milestone = scrollYProgress mapped to milestone index.
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      const idx = Math.min(
        Math.floor(latest * MILESTONES.length),
        MILESTONES.length - 1
      );
      setActiveIdx((prev) => (prev === idx ? prev : Math.max(0, idx)));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <>
      <section
        id="journey"
        ref={sectionRef}
        className="relative bg-bg-base px-5 md:px-8 lg:px-12"
        style={{ minHeight: `${MILESTONES.length * SCROLL_PER_CHAPTER}vh` }}
      >
        {/* Sticky viewport — both panes pinned inside */}
        <div className="sticky top-0 flex h-screen flex-col justify-center py-14 lg:py-20">
          <div className="mx-auto w-full max-w-[1400px]">
            <header className="mb-8">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                The journey
              </div>
              <h2 className="mt-2 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
                <span className="font-serif italic">A walk</span> through the years.
              </h2>
              <p className="mt-2 max-w-[60ch] text-sm text-fg-secondary md:text-base">
                ML engineer → data scientist → B2C PM → B2B PM.
              </p>
            </header>

            {/* Two sticky panes side-by-side */}
            <div className="grid grid-cols-[100px_1fr] gap-6 md:grid-cols-[200px_1fr] md:gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
              {/* LEFT — walking visual */}
              <Pathway
                scrollYProgress={scrollYProgress}
                walking={walking}
                activeIdx={activeIdx}
              />

              {/* RIGHT — single chapter card, content swaps */}
              <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  <ChapterCard
                    key={MILESTONES[activeIdx].id}
                    milestone={MILESTONES[activeIdx]}
                    onOpen={() => setOpenIdx(activeIdx)}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MilestoneModal
        milestone={openIdx !== null ? MILESTONES[openIdx] : null}
        onClose={() => setOpenIdx(null)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Left pane — pathway with traveling figure                                   */
/* -------------------------------------------------------------------------- */

function Pathway({
  scrollYProgress,
  walking,
  activeIdx,
}: {
  scrollYProgress: MotionValue<number>;
  walking: boolean;
  activeIdx: number;
}) {
  const figureY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative flex h-[420px] flex-col items-center md:h-[480px] lg:h-[520px]">
      {/* Counter — top of pane */}
      <div className="mb-4 text-center md:mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary md:text-xs">
          Chapter {String(activeIdx + 1).padStart(2, "0")}/{String(MILESTONES.length).padStart(2, "0")}
        </div>
        <div className="mt-1 font-serif text-2xl italic tracking-headline text-fg-primary md:text-4xl">
          {MILESTONES[activeIdx]?.year ?? "—"}
        </div>
      </div>

      {/* The path */}
      <div className="relative w-1 flex-1">
        {/* Dashed track */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, hsl(var(--border-subtle)) 0, hsl(var(--border-subtle)) 6px, transparent 6px, transparent 12px)",
            backgroundSize: "100% 12px",
            backgroundRepeat: "repeat-y",
          }}
        />

        {/* Progress fill */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 rounded-full"
          style={{
            height: lineHeight,
            background:
              "linear-gradient(to bottom, hsl(var(--brand-magenta)), hsl(var(--brand-violet)))",
          }}
        />

        {/* Walking figure */}
        <motion.div
          className="absolute left-1/2 z-10 -translate-x-1/2"
          style={{ top: figureY, y: "-50%" }}
        >
          <WalkingFigure walking={walking} />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Right pane — single chapter card (swaps content via AnimatePresence)        */
/* -------------------------------------------------------------------------- */

function ChapterCard({
  milestone,
  onOpen,
}: {
  milestone: Milestone;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="View details"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group glass specular relative flex h-[420px] w-full flex-col overflow-hidden rounded-3xl border-0 p-6 text-left transition-[background-color] duration-300 ease-spring hover:bg-[hsl(var(--glass-material-strong))] md:h-[480px] md:p-8 lg:h-[520px] lg:p-10"
    >
      {/* Color halo */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${COLOR_HALO[milestone.color]} opacity-80`}
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Logo */}
        {milestone.logo ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-white/95 ring-1 ring-border-subtle md:h-16 md:w-16">
            <Image src={milestone.logo} alt="" fill sizes="64px" className="object-contain" />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-magenta to-brand-violet text-xl font-semibold text-white md:h-16 md:w-16">
            {milestone.org.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
            <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
              {TYPE_LABEL[milestone.type]}
            </span>
            <span>·</span>
            <span>{milestone.dates}</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-fg-secondary md:text-base">
            {milestone.org}
          </div>
        </div>
      </div>

      <h3 className="relative z-10 mt-6 text-2xl font-bold leading-tight tracking-headline text-fg-primary md:text-3xl lg:text-4xl">
        {milestone.title}
      </h3>

      <p className="relative z-10 mt-4 text-sm leading-relaxed text-fg-secondary md:text-base">
        {milestone.shipped}
      </p>

      {milestone.description && (
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-fg-tertiary md:text-base">
          {milestone.description}
        </p>
      )}

      <div className="relative z-10 mt-auto flex items-end justify-between pt-6">
        <div className="flex flex-wrap gap-1.5">
          {milestone.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-bg-elevated px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
        <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-fg-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

function MilestoneModal({
  milestone,
  onClose,
}: {
  milestone: Milestone | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!milestone) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [milestone, onClose]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="milestone-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg-base/80 px-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl border border-border-strong bg-bg-elevated p-6 md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-cursor="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-fg-tertiary transition-colors hover:bg-bg-card hover:text-fg-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              {milestone.logo ? (
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-white/95 ring-1 ring-border-subtle">
                  <Image src={milestone.logo} alt="" fill sizes="56px" className="object-contain" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-magenta to-brand-violet text-lg font-semibold text-white">
                  {milestone.org.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                  {milestone.year} · {milestone.dates}
                </div>
                <h3
                  id="milestone-title"
                  className="mt-1 text-2xl font-bold leading-tight tracking-headline text-fg-primary md:text-3xl"
                >
                  {milestone.title}
                </h3>
                <div className="mt-1 text-base text-fg-secondary">{milestone.org}</div>
              </div>
            </div>

            {milestone.location && (
              <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-fg-tertiary">
                <MapPin className="h-3.5 w-3.5" />
                {milestone.location}
              </div>
            )}

            <p className="mt-6 text-base leading-relaxed text-fg-secondary md:text-lg">
              {milestone.description ?? milestone.shipped}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border-subtle bg-bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
