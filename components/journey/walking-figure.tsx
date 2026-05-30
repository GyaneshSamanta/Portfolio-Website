"use client";

/**
 * WalkingFigure — rev v3.2
 *
 * Clean SVG stick walker with diagonal limb pairing (left arm + right leg
 * forward together). All rotations are SVG-native `transform="rotate()"` so
 * pivots are guaranteed to be at the joint, not floating in space.
 *
 * Bug fix from v3.1: previous version used `transformBox: "fill-box"` on
 * motion.line which makes transform-origin relative to each line's tiny
 * bounding box — caused legs to rotate around their own midpoint and visibly
 * detach from the torso. Now uses `<g transform="rotate(deg X Y)">` with X/Y
 * in viewBox coordinates.
 */

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  walking: boolean;
};

const STEP_DURATION = 0.85;
const ARM_SWING = 10;
const LEG_SWING = 18;

export function WalkingFigure({ walking }: Props) {
  const reduced = useReducedMotion();
  const animate = walking && !reduced;

  const tween = {
    duration: STEP_DURATION,
    repeat: animate ? Infinity : 0,
    ease: "easeInOut",
  } as const;

  // Phase-A / Phase-B sequence of angles
  const phaseAAngles = animate ? [-ARM_SWING, ARM_SWING, -ARM_SWING] : [0, 0, 0];
  const phaseBAngles = animate ? [ARM_SWING, -ARM_SWING, ARM_SWING] : [0, 0, 0];
  const phaseALegAngles = animate ? [-LEG_SWING, LEG_SWING, -LEG_SWING] : [0, 0, 0];
  const phaseBLegAngles = animate ? [LEG_SWING, -LEG_SWING, LEG_SWING] : [0, 0, 0];

  return (
    <motion.div
      className="relative h-[72px] w-[40px]"
      animate={animate ? { y: [0, -1.5, 0, -1.5, 0] } : { y: 0 }}
      transition={tween}
    >
      {/* Halo */}
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
            {/* Cream / soft-cyan so the figure pops OFF the magenta progress line
                instead of blending into it. */}
            <stop offset="0%" stopColor="#FFF6E0" />
            <stop offset="100%" stopColor="#C8E8FF" />
          </linearGradient>
          {/* Soft white halo around each stroke so the figure stays legible
              against any path color. */}
          <filter id="figureGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#figureGlow)">

        {/* Head */}
        <circle cx="20" cy="10" r="6" fill="url(#figureGrad)" />

        {/* Torso */}
        <path d="M16 18 Q20 17 24 18 L23 36 Q20 37 17 36 Z" fill="url(#figureGrad)" />

        {/* Each limb sits inside an animated <g> whose SVG transform rotates
            around the joint at viewBox coords (X, Y). transformOrigin/box
            shenanigans avoided entirely. */}

        {/* Phase-A left arm — pivot at left shoulder (17, 22) */}
        <motion.g
          style={{ originX: 0, originY: 0 }}
          animate={{ rotate: phaseAAngles }}
          transition={tween}
          transform="translate(17 22)"
        >
          <line
            x1="0"
            y1="0"
            x2="-4"
            y2="12"
            stroke="url(#figureGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Phase-A right leg — pivot at right hip (22, 36) */}
        <motion.g
          style={{ originX: 0, originY: 0 }}
          animate={{ rotate: phaseALegAngles }}
          transition={tween}
          transform="translate(22 36)"
        >
          <line
            x1="0"
            y1="0"
            x2="2"
            y2="22"
            stroke="url(#figureGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Phase-B right arm — pivot at right shoulder (23, 22) */}
        <motion.g
          style={{ originX: 0, originY: 0 }}
          animate={{ rotate: phaseBAngles }}
          transition={tween}
          transform="translate(23 22)"
        >
          <line
            x1="0"
            y1="0"
            x2="4"
            y2="12"
            stroke="url(#figureGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Phase-B left leg — pivot at left hip (18, 36) */}
        <motion.g
          style={{ originX: 0, originY: 0 }}
          animate={{ rotate: phaseBLegAngles }}
          transition={tween}
          transform="translate(18 36)"
        >
          <line
            x1="0"
            y1="0"
            x2="-2"
            y2="22"
            stroke="url(#figureGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>

        </g>

        {/* Ground shadow — outside the glow filter so it stays subtle */}
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
