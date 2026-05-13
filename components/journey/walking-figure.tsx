"use client";

/**
 * WalkingFigure — DESIGN.md §5.3 (rev v2.1)
 * Clean SVG stick-walker. Arms + legs cycle while `walking` is true.
 * Glowing brand halo behind the figure. Honors prefers-reduced-motion.
 *
 * Replaces the earlier "abstract comet dot" — the user explicitly wanted a
 * human silhouette back, but designed to feel modern, not pixel-junior.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();
  const animateLimbs = walking && !reduced;

  // Limb rotation cycles back and forth — opposite sides offset by 180°.
  const cycle = animateLimbs
    ? { rotate: [-22, 22, -22] }
    : { rotate: 0 };

  const transition = {
    duration: 0.55,
    repeat: animateLimbs ? Infinity : 0,
    ease: "easeInOut",
  } as const;

  return (
    <div className="relative h-[72px] w-[40px]">
      {/* Soft glow halo behind the figure. */}
      <motion.div
        aria-hidden
        animate={
          reduced
            ? {}
            : { opacity: walking ? 0.7 : 0.45, scale: walking ? [1, 1.15, 1] : 1 }
        }
        transition={{ duration: 0.9, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
        className="absolute inset-0 -z-[1] rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.7), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 40 72"
        width="40"
        height="72"
        aria-hidden
        className="block"
      >
        <defs>
          <linearGradient id="figureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-magenta))" />
            <stop offset="100%" stopColor="hsl(var(--brand-violet))" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="20" cy="10" r="6" fill="url(#figureGrad)" />

        {/* Torso */}
        <path
          d="M16 18 Q20 17 24 18 L23 36 Q20 37 17 36 Z"
          fill="url(#figureGrad)"
        />

        {/* Arms — opposing rotation */}
        <motion.line
          x1="17"
          y1="22"
          x2="11"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={cycle}
          transition={transition}
          style={{ transformOrigin: "17px 22px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="23"
          y1="22"
          x2="29"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={animateLimbs ? { rotate: [22, -22, 22] } : { rotate: 0 }}
          transition={transition}
          style={{ transformOrigin: "23px 22px", transformBox: "fill-box" }}
        />

        {/* Legs — opposing rotation */}
        <motion.line
          x1="18"
          y1="36"
          x2="14"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={cycle}
          transition={transition}
          style={{ transformOrigin: "18px 36px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="22"
          y1="36"
          x2="26"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={animateLimbs ? { rotate: [22, -22, 22] } : { rotate: 0 }}
          transition={transition}
          style={{ transformOrigin: "22px 36px", transformBox: "fill-box" }}
        />

        {/* Ground shadow */}
        <ellipse cx="20" cy="66" rx="9" ry="2" fill="hsl(var(--bg-base))" opacity="0.55" />
      </svg>
    </div>
  );
}
