"use client";

/**
 * SelectedWork — DESIGN.md §5.4
 * 12-col bento, 6 hand-picked tiles spanning Product / Research / Hackathons.
 * Filter chips re-flow the grid via Framer's `layout` animation. Click opens
 * a slide-over modal with full case-study content.
 */

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers, X } from "lucide-react";
import workData from "@/data/work.json";

type Work = (typeof workData)[number];
type Category = "all" | "product" | "research" | "hackathon";

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "product", label: "Product" },
  { id: "research", label: "Research" },
  { id: "hackathon", label: "Hackathons" },
];

const SIZE_SPAN: Record<string, string> = {
  hero: "lg:col-span-8 lg:row-span-2",
  feature: "lg:col-span-8",
  standard: "lg:col-span-4 lg:row-span-2",
  compact: "lg:col-span-4",
};

export function SelectedWorkSection() {
  const [filter, setFilter] = useState<Category>("all");
  const [open, setOpen] = useState<Work | null>(null);

  const items = useMemo(
    () => (filter === "all" ? workData : workData.filter((w) => w.category === filter)),
    [filter]
  );

  return (
    <section
      id="work"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <Layers className="h-3.5 w-3.5" />
              Selected work
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              Six things I'm <span className="font-serif italic">proud</span> of.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Curated, not exhaustive. Tap any tile for the full story.
            </p>
          </div>

          {/* Filter chips. */}
          <div role="tablist" aria-label="Filter work by category" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                data-cursor={`Filter: ${f.label}`}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ease-swift ${
                  filter === f.id
                    ? "border-border-glow bg-brand-magenta/15 text-fg-primary"
                    : "border-border-subtle bg-bg-card/40 text-fg-secondary hover:border-border-strong hover:text-fg-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <motion.div
          layout
          className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12"
        >
          <AnimatePresence mode="popLayout">
            {items.map((w) => (
              <WorkTile key={w.id} work={w} onOpen={() => setOpen(w)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <WorkModal work={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function WorkTile({ work, onOpen }: { work: Work; onOpen: () => void }) {
  const span = SIZE_SPAN[work.size] ?? SIZE_SPAN.compact;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      data-cursor="Open"
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 p-5 text-left backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 md:p-6 ${span}`}
    >
      {work.coverImage && (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden md:-mx-6 md:-mt-6">
          <Image
            src={work.coverImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-500 ease-swift group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent" />
        </div>
      )}

      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-fg-tertiary">
        <span>{work.category}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg-primary md:text-xl">
        {work.title}
      </h3>
      {work.subtitle && (
        <p className="mt-1 text-sm text-fg-secondary">{work.subtitle}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {work.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */

function WorkModal({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!work) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [work, onClose]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="work-title"
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
            className="ml-auto h-full w-full overflow-y-auto border-l border-border-strong bg-bg-elevated p-6 md:max-w-2xl md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-cursor="Close"
              className="ml-auto flex rounded-full p-2 text-fg-tertiary transition-colors hover:bg-bg-card hover:text-fg-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              {work.category}
            </div>
            <h3
              id="work-title"
              className="mt-3 text-3xl font-bold leading-tight text-fg-primary md:text-4xl"
            >
              {work.title}
            </h3>
            {work.subtitle && (
              <p className="mt-2 text-base text-fg-secondary md:text-lg">{work.subtitle}</p>
            )}

            {work.coverImage && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border-subtle">
                <Image
                  src={work.coverImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
            )}

            <p className="mt-6 text-base leading-relaxed text-fg-secondary md:text-lg">
              {work.description}
            </p>

            {work.metrics && work.metrics.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {work.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-border-subtle bg-bg-card p-4"
                  >
                    <div className="text-xl font-bold text-fg-primary md:text-2xl">{m.value}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {work.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border-subtle bg-bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-secondary"
                >
                  {t}
                </span>
              ))}
            </div>

            {work.links && work.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {work.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={l.label}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 ease-swift hover:scale-[1.03]"
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
