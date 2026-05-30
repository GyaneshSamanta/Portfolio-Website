"use client";

/**
 * Journey — DESIGN.md §5.3 (rev v3.0 — split-pane redesign)
 *
 * Old: horizontal scroll-jacked walk where the figure stayed pinned and
 *      polaroid cards slid past. Brittle math, cards cropped, overshoot bug.
 *
 * New: vertical split-pane composition.
 *
 *   ┌──────────────────────┬──────────────────────┐
 *   │                      │  ─── 2019 ───         │
 *   │   sticky walking     │  ┌─────────────┐     │
 *   │   visual + path      │  │ SRM University│     │
 *   │   (left, 5 cols)     │  └─────────────┘     │
 *   │                      │  ─── 2020 ───         │
 *   │   • Walking figure   │  ┌─────────────┐     │
 *   │   • Vertical path    │  │ SRM IIC      │     │
 *   │   • Year marker      │  └─────────────┘     │
 *   │   • Progress dots    │  ...                  │
 *   │                      │                       │
 *   └──────────────────────┴──────────────────────┘
 *           7 / 12 chapters · "Snapdeal"  ← live label
 *
 * As the user scrolls, the figure ascends the path on the left while
 * milestone cards stream in from the right. The active milestone is the one
 * currently nearest the figure's vertical position.
 *
 * Mobile: same content; the left visual collapses to a thin path on the left
 * edge with year-dots, cards stack vertically on the right.
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
import { MapPin, X } from "lucide-react";
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

const TYPE_LABEL: Record<Milestone["type"], string> = {
  education: "Education",
  role: "Full-time",
  internship: "Internship",
  milestone: "Milestone",
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

  // Active = milestone closest to scroll progress
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
        className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <header className="mb-12 lg:mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              The journey
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
              <span className="font-serif italic">A walk</span> through the years.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              ML engineer → data scientist → B2C PM → B2B PM. The path tightened with each
              step.
            </p>
          </header>

          {/* Split pane: walking visual (left) + chapter cards (right) */}
          <div className="grid grid-cols-[60px_1fr] gap-5 md:grid-cols-[100px_1fr] md:gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* LEFT — sticky walking visual */}
            <aside className="relative">
              <div className="sticky top-32 flex flex-col items-center">
                <Pathway
                  scrollYProgress={scrollYProgress}
                  walking={walking}
                  activeIdx={activeIdx}
                />
              </div>
            </aside>

            {/* RIGHT — chapter cards stack */}
            <ol className="flex flex-col gap-6 md:gap-8">
              {MILESTONES.map((m, i) => (
                <ChapterCard
                  key={m.id}
                  milestone={m}
                  index={i}
                  active={i === activeIdx}
                  onOpen={() => setOpenIdx(i)}
                />
              ))}
            </ol>
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
  // Figure ascends from top to bottom of the path as user scrolls.
  const figureY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Progress line fills behind the figure.
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const current = MILESTONES[activeIdx];

  return (
    <div className="relative w-full">
      {/* Active year + counter — desktop only label above the path */}
      <div className="mb-8 hidden lg:block">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          Chapter {String(activeIdx + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
        </div>
        <div className="mt-2 font-serif text-3xl italic tracking-headline text-fg-primary">
          {current?.year ?? "—"}
        </div>
        <div className="mt-1 text-sm text-fg-secondary">{current?.org ?? ""}</div>
      </div>

      {/* The path — vertical dashed line with progress fill */}
      <div className="relative mx-auto h-[480px] w-1 md:h-[600px]">
        {/* Track background */}
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

        {/* Progress fill (solid gradient up to figure) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 rounded-full"
          style={{
            height: lineHeight,
            background:
              "linear-gradient(to bottom, hsl(var(--brand-magenta)), hsl(var(--brand-violet)))",
          }}
        />

        {/* Walking figure — moves vertically with scroll */}
        <motion.div
          className="absolute left-1/2 z-10 -translate-x-1/2"
          style={{ top: figureY, y: "-50%" }}
        >
          <WalkingFigure walking={walking} />
        </motion.div>
      </div>

      {/* Mobile/tablet active label below the path */}
      <div className="mt-6 text-center lg:hidden">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          {String(activeIdx + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
        </div>
        <div className="mt-1 font-serif text-base italic text-fg-primary">
          {current?.year}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Right pane — chapter cards                                                  */
/* -------------------------------------------------------------------------- */

const COLOR_GLOW: Record<Milestone["color"], string> = {
  purple: "from-brand-purple/40 to-transparent",
  pink: "from-brand-pink/40 to-transparent",
  violet: "from-brand-violet/40 to-transparent",
  magenta: "from-brand-magenta/40 to-transparent",
};

function ChapterCard({
  milestone,
  index,
  active,
  onOpen,
}: {
  milestone: Milestone;
  index: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="list-none"
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="View details"
        className={`group glass specular relative w-full overflow-hidden rounded-3xl border-0 p-5 text-left transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))] md:p-6 ${
          active ? "ring-1 ring-brand-magenta/40" : ""
        }`}
      >
        {/* Color tinted halo when active */}
        {active && (
          <div
            aria-hidden
            className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${COLOR_GLOW[milestone.color]} opacity-80`}
          />
        )}

        <div className="relative z-10 flex items-start gap-4">
          {/* Logo */}
          {milestone.logo ? (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/95 ring-1 ring-border-subtle">
              <Image src={milestone.logo} alt="" fill sizes="48px" className="object-contain" />
            </div>
          ) : (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-magenta to-brand-violet text-base font-semibold text-white">
              {milestone.org.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
              <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
                {milestone.year}
              </span>
              <span>·</span>
              <span>{TYPE_LABEL[milestone.type]}</span>
              <span>·</span>
              <span className="text-fg-secondary">{milestone.dates}</span>
            </div>

            <div className="mt-2 text-base font-semibold tracking-headline text-fg-primary md:text-lg">
              {milestone.title}
            </div>
            <div className="text-sm text-fg-secondary">{milestone.org}</div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-secondary">
              {milestone.shipped}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {milestone.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    </motion.li>
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
