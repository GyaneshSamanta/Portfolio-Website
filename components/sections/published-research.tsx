"use client";

/**
 * PublishedResearch — DESIGN.md §5.4b (rev v3.0)
 *
 * Dedicated section for peer-reviewed academic work. The previous "Research"
 * sub-section inside Selected Work didn't communicate that these are real
 * IEEE-published papers. This section makes the academic credibility unmissable:
 *
 *  - Section header explicitly "Published Research"
 *  - Sub-header lists venues (IEEE ICECAA, ICNWC, ICICCS)
 *  - Each paper card: large IEEE badge, venue + conference + year prominently,
 *    co-authors, "Read on IEEE Xplore" CTA
 *  - Glass material on cards
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import workData from "@/data/work.json";

type Paper = (typeof workData)[number];

const AFFILIATIONS: Record<string, string> = {
  "pegasus-spyware": "Co-authored · SRM University",
  "nft-modeling": "Co-authored · SRM University",
  "iot-network": "Research Fellowship · TIH-IoT, IIT Bombay",
};

export function PublishedResearchSection() {
  const [open, setOpen] = useState<Paper | null>(null);

  return (
    <section
      id="research"
      className="relative px-5 py-14 md:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <BookOpen className="h-3.5 w-3.5" />
            Published Research
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
            <span className="font-serif italic">Peer-reviewed</span>, indexed by IEEE.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Three publications across cybersecurity, blockchain analytics, and IoT systems —
            presented at IEEE ICECAA, ICNWC, and ICICCS.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {workData.map((p) => (
            <PaperCard key={p.id} paper={p} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      <PaperModal paper={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function PaperCard({ paper, onOpen }: { paper: Paper; onOpen: () => void }) {
  const affiliation = AFFILIATIONS[paper.id] ?? "Independent research";
  const venue = paper.subtitle ?? "IEEE";
  const year = paper.metrics?.find((m) => m.label === "Year")?.value ?? "";

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Read paper"
      className="group glass specular relative flex h-full flex-col rounded-3xl border-0 text-left transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))]"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={paper.coverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.03]"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* IEEE badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md glass specular px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-magenta ring-1 ring-brand-magenta/30">
            IEEE
            {year && <span className="text-fg-tertiary">· {year}</span>}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-fg-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
        </div>

        <h3 className="line-clamp-3 text-base font-semibold leading-snug tracking-headline text-fg-primary md:text-lg">
          {paper.title}
        </h3>

        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-secondary">
          {venue}
        </div>

        <div className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-tertiary">
          {affiliation}
        </div>
      </div>
    </button>
  );
}

function PaperModal({ paper, onClose }: { paper: Paper | null; onClose: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!paper) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [paper, onClose]);

  return (
    <AnimatePresence>
      {paper && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="paper-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex bg-bg-base/80 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto h-full w-full overflow-y-auto border-l border-white/10 glass-strong specular shadow-[-12px_0_48px_rgba(0,0,0,0.4)] p-6 md:max-w-2xl md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-cursor="Close"
              className="ml-auto flex rounded-full p-2 text-fg-tertiary transition-all hover:bg-white/[0.08] hover:text-fg-primary relative z-[2]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 rounded-md glass specular px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-magenta ring-1 ring-brand-magenta/30">
              IEEE Publication
            </div>

            <h3
              id="paper-title"
              className="mt-4 text-3xl font-bold leading-tight tracking-headline text-fg-primary md:text-4xl"
            >
              {paper.title}
            </h3>
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.15em] text-fg-secondary">
              {paper.subtitle}
            </p>

            {paper.coverImage && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={paper.coverImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <p className="mt-6 text-base leading-relaxed text-fg-secondary md:text-lg">
              {paper.description}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl glass specular px-4 py-3">
              <BookOpen className="h-4 w-4 text-fg-tertiary" />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-fg-secondary">
                {AFFILIATIONS[paper.id]}
              </span>
            </div>

            {paper.links && paper.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {paper.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={l.label}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 ease-spring hover:scale-[1.03]"
                  >
                    {l.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
