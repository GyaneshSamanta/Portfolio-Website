"use client";

/**
 * MilestonePolaroid — DESIGN.md §5.3
 * Polaroid-style card for a single milestone. Slightly rotated and tinted
 * with the milestone's `color` token. Active variant scales up with a glow.
 * Used by both the horizontal walk (desktop) and the vertical fallback.
 */

import Image from "next/image";
import { motion } from "framer-motion";

type Color = "purple" | "pink" | "violet" | "magenta";

export type Milestone = {
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
  color: Color;
  isFuture?: boolean;
};

const COLOR_BORDER: Record<Color, string> = {
  purple: "from-brand-purple/40 to-brand-purple/0",
  pink: "from-brand-pink/40 to-brand-pink/0",
  violet: "from-brand-violet/40 to-brand-violet/0",
  magenta: "from-brand-magenta/40 to-brand-magenta/0",
};

const COLOR_GLOW: Record<Color, string> = {
  purple: "shadow-[0_8px_40px_-10px_hsl(var(--brand-purple)/0.55)]",
  pink: "shadow-[0_8px_40px_-10px_hsl(var(--brand-pink)/0.55)]",
  violet: "shadow-[0_8px_40px_-10px_hsl(var(--brand-violet)/0.55)]",
  magenta: "shadow-[0_8px_40px_-10px_hsl(var(--brand-magenta)/0.55)]",
};

const TYPE_LABEL: Record<Milestone["type"], string> = {
  education: "Education",
  role: "Full-time",
  internship: "Internship",
  milestone: "Milestone",
};

type Props = {
  milestone: Milestone;
  rotateDeg?: number;
  active?: boolean;
  onClick?: () => void;
};

export function MilestonePolaroid({ milestone, rotateDeg = 0, active, onClick }: Props) {
  const isFuture = milestone.isFuture;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${milestone.org} — ${milestone.title}`}
      data-cursor="View details"
      animate={{ scale: active ? 1.05 : 1, rotate: rotateDeg }}
      whileHover={{ scale: active ? 1.07 : 1.03 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`group relative w-[260px] cursor-none rounded-3xl border bg-bg-card p-4 text-left transition-colors duration-300 ease-swift md:w-[280px] ${
        active
          ? `border-border-glow ${COLOR_GLOW[milestone.color]}`
          : "border-border-subtle hover:border-border-strong"
      } ${isFuture ? "border-dashed opacity-90" : ""}`}
    >
      {/* Tinted gradient border halo. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${COLOR_BORDER[milestone.color]} opacity-${active ? 100 : 0} transition-opacity duration-300`}
        style={{ mixBlendMode: "screen" }}
      />

      <div className="flex items-center gap-3">
        {milestone.logo ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-bg-elevated ring-1 ring-border-subtle">
            <Image src={milestone.logo} alt="" fill sizes="40px" className="object-contain p-1.5" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-magenta to-brand-violet text-sm font-semibold text-white">
            {milestone.org.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
            {milestone.year} · {TYPE_LABEL[milestone.type]}
          </div>
          <div className="truncate text-sm font-semibold text-fg-primary">{milestone.org}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-base font-semibold leading-tight text-fg-primary">
          {milestone.title}
        </div>
        <div className="mt-1 font-mono text-[11px] text-fg-tertiary">{milestone.dates}</div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-fg-secondary">{milestone.shipped}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {milestone.tags.slice(0, 3).map((tag) => (
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
