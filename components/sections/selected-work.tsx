"use client";

/**
 * SelectedWork — DESIGN.md §5.4 (rev v2.1)
 * Curated 6-tile grid (3×2 on desktop, 2×3 on tablet, 1×6 on mobile).
 * No filter chips. Tile categories tell the story by ordering:
 *   1. GitHub repo (NotebookLM)
 *   2. GitHub repo (cue)
 *   3. Newsletter pointer
 *   4. Research paper (Pegasus)
 *   5. Research paper (NFT)
 *   6. Research paper (IoT)
 *
 * Each tile uses its `category` for a small label badge. The hero/feature/
 * standard/compact size mapping is gone; every tile is uniform.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Layers, Newspaper, X, FileText } from "lucide-react";
import workData from "@/data/work.json";

type Work = (typeof workData)[number];

const CATEGORY_META: Record<string, { label: string; Icon: any }> = {
  repo: { label: "Open source", Icon: Github },
  research: { label: "Research", Icon: FileText },
  newsletter: { label: "Newsletter", Icon: Newspaper },
  product: { label: "Product", Icon: Layers },
  hackathon: { label: "Hackathon", Icon: Layers },
};

export function SelectedWorkSection() {
  const [open, setOpen] = useState<Work | null>(null);

  return (
    <section
      id="work"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Layers className="h-3.5 w-3.5" />
            Selected work
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            Six things I'm <span className="font-serif italic">proud</span> of.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Two shipped repos. One newsletter. Three peer-reviewed papers. Tap any tile for the full story.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {workData.map((w) => (
            <WorkTile key={w.id} work={w} onOpen={() => setOpen(w)} />
          ))}
        </div>
      </div>

      <WorkModal work={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function WorkTile({ work, onOpen }: { work: Work; onOpen: () => void }) {
  const meta = CATEGORY_META[work.category] ?? { label: work.category, Icon: Layers };
  const Icon = meta.Icon;

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Open"
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 text-left backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70"
    >
      {/* Thumbnail / cover. */}
      <div className="relative aspect-[16/9] overflow-hidden bg-bg-elevated">
        {work.coverImage ? (
          /* GitHub OG hashes / local images / external — use a plain img since
             these change frequently (OG hash) or come from /public unoptimized. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.coverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-swift group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/25 via-brand-purple/15 to-bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/20 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          <span className="inline-flex items-center gap-1.5">
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-fg-primary md:text-lg">
          {work.title}
        </h3>
        {work.subtitle && (
          <p className="mt-1 line-clamp-1 text-xs text-fg-secondary md:text-sm">{work.subtitle}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {work.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
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
              {CATEGORY_META[work.category]?.label ?? work.category}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={work.coverImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
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
                    target={l.url.startsWith("http") ? "_blank" : undefined}
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
