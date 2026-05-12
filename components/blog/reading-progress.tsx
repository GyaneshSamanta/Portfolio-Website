"use client";

/**
 * ReadingProgress — thin gradient bar pinned below the navbar that fills as
 * the user scrolls through the article body.
 */

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, type RefObject } from "react";

export function ReadingProgress({ targetRef }: { targetRef: RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[61] h-0.5 origin-left bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-violet"
      style={{ scaleX }}
    />
  );
}

export function useArticleRef() {
  return useRef<HTMLElement>(null);
}
