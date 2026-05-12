"use client";

/**
 * WalkingFigure — DESIGN.md §5.3 (sleek variant).
 * Earlier abstract pixel-cartoon read as junior. Replaced with a clean
 * traveler: a brand-magenta core surrounded by a soft glow halo, with a
 * fading comet tail that elongates while moving. Hides on reduced motion.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center">
      {/* Comet tail — only visible while moving. */}
      <motion.div
        aria-hidden
        className="absolute right-full mr-1 h-1.5 rounded-full"
        animate={
          reduced
            ? { opacity: 0 }
            : { opacity: walking ? 0.85 : 0, width: walking ? 56 : 12 }
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(var(--brand-magenta) / 0.0) 5%, hsl(var(--brand-magenta) / 0.5) 45%, hsl(var(--brand-magenta)) 100%)",
        }}
      />

      {/* Outer halo. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        animate={reduced ? {} : { scale: walking ? [1, 1.25, 1] : 1, opacity: walking ? 0.7 : 0.45 }}
        transition={{ duration: 0.8, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.6), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Core dot. */}
      <div className="relative h-4 w-4 rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet shadow-[0_0_24px_-2px_hsl(var(--brand-magenta))]" />
    </div>
  );
}
