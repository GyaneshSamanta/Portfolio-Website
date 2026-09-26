"use client";

/**
 * KineticHeading — DESIGN.md §5.1
 * Per-letter blur-and-fade-in animation. Stagger 60ms, blur(8px) → 0,
 * opacity 0 → 1, 600ms total. Honors prefers-reduced-motion.
 *
 * Now accepts a `style` prop so callers can compose a gradient-flow background.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  as?: "h1" | "h2" | "h3" | "span";
  /** Delay before stagger starts (s). */
  delay?: number;
  /** Render the text as italic serif (for editorial moments). */
  serif?: boolean;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: "0.2em" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function KineticHeading({
  text,
  className,
  style,
  as = "h1",
  delay = 0,
  serif = false,
}: Props) {
  const reduced = useReducedMotion();
  const Component = motion[as] as typeof motion.h1;

  const composedStyle: CSSProperties = {
    ...(serif ? { fontStyle: "italic" } : {}),
    ...(style ?? {}),
  };

  if (reduced) {
    const Static: "h1" | "h2" | "h3" | "span" = as;
    return (
      <Static className={className} style={composedStyle}>
        {text}
      </Static>
    );
  }

  // Whitespace preserved as its own non-animated span so wrapping behaves.
  const words = text.split(/(\s+)/);

  return (
    <Component
      className={className}
      style={composedStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) {
          return <span key={wi}>{word}</span>;
        }
        return (
          <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, ci) => (
              <motion.span
                key={ci}
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Component>
  );
}
