"use client";

/**
 * WalkingFigure — DESIGN.md §5.3 (rev v2.2)
 * Clean SVG stick walker. Proper diagonal pairing (left arm + right leg
 * forward together) with a subtle vertical bob synced to the step cycle.
 * Brand-magenta halo follows the figure. Honors prefers-reduced-motion.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

const STEP_DURATION = 0.7; // seconds per full step pair
const SWING = 28; // degrees of limb rotation

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();
  const animate = walking && !reduced;

  // Left-pair (arm-L + leg-R) and right-pair (arm-R + leg-L) swing opposite
  const leftPair = animate ? { rotate: [-SWING, SWING, -SWING] } : { rotate: 0 };
  const rightPair = animate ? { rotate: [SWING, -SWING, SWING] } : { rotate: 0 };
  const tween = {
    duration: STEP_DURATION,
    repeat: animate ? Infinity : 0,
    ease: "easeInOut",
  } as const;

  return (
    <motion.div
      className="relative h-[72px] w-[40px]"
      // Body bob — twice the step cycle so each step has an up-down beat.
      animate={animate ? { y: [0, -2, 0, -2, 0] } : { y: 0 }}
      transition={{
        duration: STEP_DURATION,
        repeat: animate ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {/* Soft glow halo behind the figure. */}
      <motion.div
        aria-hidden
        animate={
          reduced
            ? {}
            : { opacity: walking ? 0.75 : 0.45, scale: walking ? [1, 1.1, 1] : 1 }
        }
        transition={{
          duration: STEP_DURATION * 1.5,
          repeat: walking ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute inset-0 -z-[1] rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.7), transparent 70%)",
        }}
      />

      <svg viewBox="0 0 40 72" width="40" height="72" aria-hidden className="block">
        <defs>
          <linearGradient id="figureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-magenta))" />
            <stop offset="100%" stopColor="hsl(var(--brand-violet))" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="20" cy="10" r="6" fill="url(#figureGrad)" />

        {/* Torso */}
        <path d="M16 18 Q20 17 24 18 L23 36 Q20 37 17 36 Z" fill="url(#figureGrad)" />

        {/* Left arm + right leg swing together (left pair) */}
        <motion.line
          x1="17"
          y1="22"
          x2="11"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={leftPair}
          transition={tween}
          style={{ transformOrigin: "17px 22px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="22"
          y1="36"
          x2="26"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={leftPair}
          transition={tween}
          style={{ transformOrigin: "22px 36px", transformBox: "fill-box" }}
        />

        {/* Right arm + left leg swing together (right pair) */}
        <motion.line
          x1="23"
          y1="22"
          x2="29"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={rightPair}
          transition={tween}
          style={{ transformOrigin: "23px 22px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="18"
          y1="36"
          x2="14"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={rightPair}
          transition={tween}
          style={{ transformOrigin: "18px 36px", transformBox: "fill-box" }}
        />

        {/* Ground shadow — pulses slightly with the bob */}
        <motion.ellipse
          cx="20"
          cy="66"
          rx="9"
          ry="2"
          fill="hsl(var(--bg-base))"
          opacity="0.55"
          animate={animate ? { rx: [9, 7, 9, 7, 9] } : { rx: 9 }}
          transition={tween}
        />
      </svg>
    </motion.div>
  );
}
