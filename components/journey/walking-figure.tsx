"use client";

/**
 * WalkingFigure — DESIGN.md §5.3 (rev v2.3)
 * Subtle, human-like walking gait.
 *  - Arms swing less than legs (real walking: arms swing about half as much).
 *  - Diagonal pairing: left arm + right leg forward together, opposite for
 *    right arm + left leg.
 *  - Slower step rhythm (0.85s/step) so each cycle has time to read.
 *  - Subtle 1.5px body bob synced to the step cycle.
 *  - prefers-reduced-motion → figure stays still.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

const STEP_DURATION = 0.85; // full step cycle
const LEG_SWING = 18; // degrees — legs swing more
const ARM_SWING = 10; // degrees — arms swing less

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();
  const animate = walking && !reduced;

  // Tween reused for all limb pairs
  const tween = {
    duration: STEP_DURATION,
    repeat: animate ? Infinity : 0,
    ease: "easeInOut",
  } as const;

  // Phase-A pair (left arm + right leg): start back, swing forward, return.
  const phaseA = (swing: number) =>
    animate ? { rotate: [-swing, swing, -swing] } : { rotate: 0 };
  // Phase-B pair (right arm + left leg): mirror.
  const phaseB = (swing: number) =>
    animate ? { rotate: [swing, -swing, swing] } : { rotate: 0 };

  return (
    <motion.div
      className="relative h-[72px] w-[40px]"
      // Body bob — tiny vertical bounce per step (heel-strike sync).
      animate={animate ? { y: [0, -1.5, 0, -1.5, 0] } : { y: 0 }}
      transition={tween}
    >
      {/* Soft halo behind the figure. */}
      <motion.div
        aria-hidden
        animate={
          reduced
            ? {}
            : { opacity: walking ? 0.65 : 0.4, scale: walking ? [1, 1.08, 1] : 1 }
        }
        transition={{
          duration: STEP_DURATION,
          repeat: walking ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute inset-0 -z-[1] rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.65), transparent 70%)",
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

        {/* Phase-A: left arm + right leg */}
        <motion.line
          x1="17"
          y1="22"
          x2="13"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={phaseA(ARM_SWING)}
          transition={tween}
          style={{ transformOrigin: "17px 22px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="22"
          y1="36"
          x2="24"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={phaseA(LEG_SWING)}
          transition={tween}
          style={{ transformOrigin: "22px 36px", transformBox: "fill-box" }}
        />

        {/* Phase-B: right arm + left leg */}
        <motion.line
          x1="23"
          y1="22"
          x2="27"
          y2="34"
          stroke="url(#figureGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={phaseB(ARM_SWING)}
          transition={tween}
          style={{ transformOrigin: "23px 22px", transformBox: "fill-box" }}
        />
        <motion.line
          x1="18"
          y1="36"
          x2="16"
          y2="58"
          stroke="url(#figureGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={phaseB(LEG_SWING)}
          transition={tween}
          style={{ transformOrigin: "18px 36px", transformBox: "fill-box" }}
        />

        {/* Ground shadow */}
        <motion.ellipse
          cx="20"
          cy="66"
          rx="8"
          ry="1.6"
          fill="hsl(var(--bg-base))"
          opacity="0.55"
          animate={animate ? { rx: [8, 6.5, 8, 6.5, 8] } : { rx: 8 }}
          transition={tween}
        />
      </svg>
    </motion.div>
  );
}
