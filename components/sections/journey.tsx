"use client";

/**
 * Journey — DESIGN.md §5.3 "the walk"
 * Desktop ≥1024px: pinned vertical scroll = horizontal travel; walking figure
 * sits centered while polaroids slide past. Active milestone scales up.
 * Mobile / reduced-motion: vertical timeline, polaroids alternate sides.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { X, MapPin } from "lucide-react";
import Image from "next/image";
import journeyData from "@/data/journey.json";
import { MilestonePolaroid, type Milestone } from "@/components/journey/milestone-polaroid";
import { WalkingFigure } from "@/components/journey/walking-figure";

const MILESTONES = journeyData as Milestone[];
// Tilt cards for character (DESIGN.md §5.3: -2deg, 1deg, -1deg, randomized).
const ROTATIONS = [-2, 1, -1, 2, -1.5, 0.5, -2, 1, -1, 0];

export function JourneySection() {
  const [isDesktop, setIsDesktop] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const useVertical = !isDesktop || reduced;
  return useVertical ? <JourneyVertical /> : <JourneyWalk />;
}

/* -------------------------------------------------------------------------- */
/* Desktop: scroll-jacked horizontal walk                                      */
/* -------------------------------------------------------------------------- */

function JourneyWalk() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [walking, setWalking] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Travel distance: roughly the natural width of all polaroids minus one
  // viewport. We estimate generously so the last polaroid fully clears.
  const travelPercent = useMemo(() => {
    // Each card ~280px + 64px gap = ~344px. Plus the path padding.
    return Math.max(60, MILESTONES.length * 18);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${travelPercent}%`]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Active = milestone closest to the viewport center.
    const fraction = Math.max(0, Math.min(1, latest));
    const idx = Math.round(fraction * (MILESTONES.length - 1));
    setActiveIdx((prev) => (prev === idx ? prev : idx));
  });

  // Walking flag toggles on for ~250ms each time the scroll progress changes.
  useEffect(() => {
    let timer: number | undefined;
    const unsub = scrollYProgress.on("change", () => {
      setWalking(true);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setWalking(false), 250);
    });
    return () => {
      unsub();
      if (timer) window.clearTimeout(timer);
    };
  }, [scrollYProgress]);

  return (
    <>
      <section
        id="journey"
        ref={sectionRef}
        className="relative bg-bg-base"
        style={{ height: `${MILESTONES.length * 70}vh` }}
      >
        {/* Sticky viewport — the actual scene the user sees. */}
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <header className="mx-auto w-full max-w-[1400px] px-12 pt-24 pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              The journey
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              <span className="font-serif italic">A walk</span> through the years.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Scroll to walk forward. Active milestone is whichever the figure is standing on.
            </p>
          </header>

          {/* Path + polaroid track. */}
          <div className="relative flex-1">
            {/* Background parallax cloud accents. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_15%_50%,hsl(var(--brand-violet)/0.18),transparent_45%),radial-gradient(circle_at_85%_60%,hsl(var(--brand-magenta)/0.15),transparent_45%)]"
            />

            {/* Dotted path baseline. */}
            <svg
              aria-hidden
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
              width="100%"
              height="6"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="3"
                x2="100%"
                y2="3"
                stroke="hsl(var(--border-subtle))"
                strokeWidth="2"
                strokeDasharray="4 8"
              />
            </svg>

            {/* Walking figure — pinned to viewport center. */}
            <div
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[80px]"
              aria-hidden
            >
              <WalkingFigure walking={walking} />
            </div>

            {/* Polaroid track — translates horizontally with scroll. */}
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="absolute left-1/2 top-1/2 flex -translate-y-1/2 items-center gap-16 will-change-transform"
            >
              {MILESTONES.map((m, i) => (
                <div key={m.id} className="flex flex-col items-center">
                  {/* The polaroid itself — sits above the line. */}
                  <div className={i % 2 === 0 ? "mb-32" : "mt-32"}>
                    <MilestonePolaroid
                      milestone={m}
                      rotateDeg={ROTATIONS[i % ROTATIONS.length]}
                      active={i === activeIdx}
                      onClick={() => setOpenIdx(i)}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Progress hint at the bottom. */}
          <div className="mx-auto w-full max-w-[1400px] px-12 pb-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            {String(activeIdx + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")} ·{" "}
            <span className="text-fg-secondary">{MILESTONES[activeIdx]?.org}</span>
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
/* Mobile / reduced-motion: vertical timeline                                  */
/* -------------------------------------------------------------------------- */

function JourneyVertical() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <section
        id="journey"
        className="relative bg-bg-base px-5 py-24 md:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <header className="mb-12">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              The journey
            </div>
            <h2 className="mt-3 text-[clamp(2rem,7vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              <span className="font-serif italic">A walk</span> through the years.
            </h2>
          </header>

          <div className="relative">
            {/* Vertical dashed path. */}
            <div
              aria-hidden
              className="absolute left-3 top-0 h-full w-px border-l-2 border-dashed border-border-subtle md:left-6"
            />

            <ul className="space-y-10">
              {MILESTONES.map((m, i) => (
                <li key={m.id} className="relative pl-10 md:pl-16">
                  {/* Dot marker. */}
                  <div
                    aria-hidden
                    className={`absolute left-0.5 top-3 h-5 w-5 rounded-full border-2 md:left-3.5 ${
                      m.isFuture
                        ? "border-dashed border-brand-magenta bg-bg-base"
                        : "border-brand-magenta bg-brand-magenta"
                    }`}
                  />
                  <MilestonePolaroid
                    milestone={m}
                    rotateDeg={0}
                    active={false}
                    onClick={() => setOpenIdx(i)}
                  />
                </li>
              ))}
            </ul>
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
/* Modal — minimal accessible dialog                                            */
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

  if (!milestone) return null;

  return (
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
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-bg-card ring-1 ring-border-subtle">
              <Image src={milestone.logo} alt="" fill sizes="56px" className="object-contain p-2" />
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
              className="mt-1 text-2xl font-bold leading-tight text-fg-primary md:text-3xl"
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
  );
}
