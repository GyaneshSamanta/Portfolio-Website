"use client";

/**
 * ResearchGrid — DESIGN.md §5.4 (rev v2.2)
 * 3-column grid (1-col mobile) of IEEE research papers. Each tile shows the
 * branded SVG cover from /public/images/papers, plus abstract + links.
 *
 * Click → slide-over modal with full description.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import workData from "@/data/work.json";

type Paper = (typeof workData)[number];

export function ResearchGrid() {
  const [open, setOpen] = useState<Paper | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {workData.map((p) => (
          <PaperTile key={p.id} paper={p} onOpen={() => setOpen(p)} />
        ))}
      </div>
      <PaperModal paper={open} onClose={() => setOpen(null)} />
    </>
  );
}

function PaperTile({ paper, onOpen }: { paper: Paper; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Read paper"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 text-left backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={paper.coverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-swift group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          <span>{paper.subtitle}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
        </div>
        <h3 className="mt-3 line-clamp-3 text-base font-semibold leading-snug text-fg-primary md:text-lg">
          {paper.title}
        </h3>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {paper.tags.slice(0, 3).map((tag) => (
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
              {paper.subtitle}
            </div>
            <h3
              id="paper-title"
              className="mt-3 text-3xl font-bold leading-tight text-fg-primary md:text-4xl"
            >
              {paper.title}
            </h3>

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

            {paper.metrics && paper.metrics.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {paper.metrics.map((m) => (
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
              {paper.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border-subtle bg-bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-secondary"
                >
                  {t}
                </span>
              ))}
            </div>

            {paper.links && paper.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {paper.links.map((l) => (
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
