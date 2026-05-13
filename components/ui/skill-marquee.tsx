"use client";

/**
 * SkillMarquee — DESIGN.md §5.1 (rev v2.1)
 * Multi-row, seamless, slower marquee.
 *
 *  - Desktop: 3 rows (left, right, left)
 *  - Mobile:  2 rows (left, right)
 *  - Clean -50% keyframe → no jitter at loop boundary
 *  - 90s linear → calm, readable pace
 *  - Respects prefers-reduced-motion (no animation; renders a single static row)
 */

import { useReducedMotion } from "framer-motion";

type Props = {
  items: string[];
  className?: string;
};

export function SkillMarquee({ items, className }: Props) {
  const reduced = useReducedMotion();
  if (!items?.length) return null;

  if (reduced) {
    // Static fallback — show all items in wrap, no animation.
    return (
      <div
        aria-label="Skills"
        className={`flex flex-wrap gap-3 ${className ?? ""}`}
      >
        {items.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    );
  }

  // Slice into 3 alternating rows for desktop. On mobile we only show 2 rows.
  const rowCount = 3;
  const rows: string[][] = Array.from({ length: rowCount }, () => []);
  items.forEach((item, i) => rows[i % rowCount].push(item));

  // Anim class per row (alternates direction).
  const animFor = (idx: number) =>
    idx % 2 === 0 ? "animate-marquee-clean" : "animate-marquee-clean-reverse";

  return (
    <div
      aria-label="Skills"
      className={`flex flex-col gap-3 ${className ?? ""}`}
    >
      {rows.map((row, idx) => (
        <Row
          key={idx}
          items={row}
          animClass={animFor(idx)}
          // Hide the 3rd row on mobile to keep vertical space tight.
          hideOnMobile={idx === 2}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Row({
  items,
  animClass,
  hideOnMobile,
}: {
  items: string[];
  animClass: string;
  hideOnMobile?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={`group/row relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${
        hideOnMobile ? "hidden md:flex" : ""
      }`}
    >
      {/* Two copies side by side with no gap between them; gap-3 only inside each copy. */}
      <ul
        className={`flex shrink-0 items-center gap-3 pr-3 ${animClass} group-hover/row:[animation-play-state:paused]`}
      >
        {items.map((item) => (
          <Chip key={`a-${item}`} label={item} />
        ))}
      </ul>
      <ul
        aria-hidden
        className={`flex shrink-0 items-center gap-3 pr-3 ${animClass} group-hover/row:[animation-play-state:paused]`}
      >
        {items.map((item) => (
          <Chip key={`b-${item}`} label={item} />
        ))}
      </ul>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <li className="rounded-full border border-border-subtle bg-bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-fg-secondary backdrop-blur-sm">
      {label}
    </li>
  );
}
