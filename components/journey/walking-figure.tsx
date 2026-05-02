"use client";

/**
 * WalkingFigure — DESIGN.md §5.3
 * Placeholder silhouette pending a real 8-frame sprite (per IMPLEMENTATION.md
 * risk register). For now: an abstract figure that bobs while scrolling.
 * The bob amplitude is driven by `walking` so it stays still when at rest.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      width="56"
      height="80"
      viewBox="0 0 56 80"
      aria-hidden
      animate={
        reduced
          ? {}
          : {
              y: walking ? [0, -3, 0, -3, 0] : 0,
            }
      }
      transition={{ duration: 0.6, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="figureFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--brand-magenta))" />
          <stop offset="100%" stopColor="hsl(var(--brand-violet))" />
        </linearGradient>
      </defs>

      {/* head */}
      <circle cx="28" cy="14" r="10" fill="url(#figureFill)" />

      {/* body — slight lean forward */}
      <path
        d="M22 24 Q28 22 34 24 L36 50 Q28 52 20 50 Z"
        fill="url(#figureFill)"
      />

      {/* legs — animate as a simple stride */}
      <motion.g
        animate={
          reduced || !walking
            ? { rotate: 0 }
            : { rotate: [-12, 12, -12] }
        }
        transition={{ duration: 0.5, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "28px 50px" }}
      >
        <rect x="22" y="50" width="5" height="22" rx="2" fill="url(#figureFill)" />
      </motion.g>
      <motion.g
        animate={
          reduced || !walking
            ? { rotate: 0 }
            : { rotate: [12, -12, 12] }
        }
        transition={{ duration: 0.5, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "28px 50px" }}
      >
        <rect x="29" y="50" width="5" height="22" rx="2" fill="url(#figureFill)" />
      </motion.g>

      {/* shadow under feet */}
      <ellipse cx="28" cy="76" rx="10" ry="2" fill="hsl(var(--bg-base))" opacity="0.6" />
    </motion.svg>
  );
}
