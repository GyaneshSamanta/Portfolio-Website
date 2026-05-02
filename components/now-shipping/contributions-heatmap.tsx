"use client";

/**
 * ContributionsHeatmap — DESIGN.md §5.2
 * 52 weeks × 7 days. Cells animate in left-to-right on scroll-into-view (12ms
 * stagger). Falls back to a static placeholder when no GraphQL data is
 * available (no GITHUB_TOKEN in env).
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { BentoTile } from "@/components/ui/bento-tile";
import type { ContributionData } from "@/lib/github";

type Props = {
  data: ContributionData | null;
  spanClass?: string;
  rowSpan?: string;
};

const LEVEL_BG = [
  "bg-bg-elevated/80",                              // 0
  "bg-brand-purple/30",                             // 1
  "bg-brand-purple/55",                             // 2
  "bg-brand-magenta/65",                            // 3
  "bg-brand-magenta",                               // 4
];

export function ContributionsHeatmap({ data, spanClass, rowSpan }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  if (!data) {
    return (
      <BentoTile spanClass={spanClass} rowSpan={rowSpan}>
        <div className="font-mono text-xs uppercase tracking-wider text-fg-tertiary">
          Contributions
        </div>
        <p className="mt-3 text-sm text-fg-secondary">
          Live heatmap unlocks once <code className="rounded bg-bg-elevated px-1 py-0.5 font-mono text-xs">GITHUB_TOKEN</code> is configured on the deploy.
        </p>
        <div
          className="mt-auto grid gap-1 pt-4"
          style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}
        >
          {Array.from({ length: 26 * 7 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm ${LEVEL_BG[((i * 7) % 5) as 0 | 1 | 2 | 3 | 4]}`}
            />
          ))}
        </div>
      </BentoTile>
    );
  }

  return (
    <BentoTile spanClass={spanClass} rowSpan={rowSpan} ariaLabel="GitHub contributions heatmap">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-fg-tertiary">
        <span>Contributions</span>
        <span className="text-fg-secondary">{data.total.toLocaleString()} this year</span>
      </div>

      <div
        ref={ref}
        className="mt-4 hide-scrollbar -mx-1 overflow-x-auto pb-1"
      >
        <div
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          style={{ minWidth: `${data.weeks.length * 13}px` }}
        >
          {data.weeks.map((week, wi) =>
            week.days.map((day, di) => {
              const delay = reduced ? 0 : wi * 0.012;
              return (
                <motion.div
                  key={`${wi}-${di}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay }}
                  className={`h-[10px] w-[10px] rounded-[3px] ${LEVEL_BG[day.level]}`}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                />
              );
            })
          )}
        </div>
      </div>
    </BentoTile>
  );
}
