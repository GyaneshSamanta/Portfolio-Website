"use client";

/**
 * ProgressRail — DESIGN.md §4
 * Replaces the right-rail dot navigation. A thin gradient bar pinned to the top
 * of the viewport that fills as the user scrolls.
 */

import { motion, useScroll, useSpring } from "framer-motion";

export function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-pink"
      style={{ scaleX }}
    />
  );
}
