"use client";

/**
 * KineticHeading — DESIGN.md §5.1
 * Per-letter blur-and-fade-in animation. Stagger 60ms, blur(8px) → 0,
 * opacity 0 → 1, 600ms total. Honors prefers-reduced-motion.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";

type Props = {
  text: string;
  className?: string;
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
  as = "h1",
  delay = 0,
  serif = false,
}: Props) {
  const reduced = useReducedMotion();
  const Component = motion[as] as typeof motion.h1;

  if (reduced) {
    const Static: "h1" | "h2" | "h3" | "span" = as;
    return (
      <Static className={className} {...(serif && { style: { fontStyle: "italic" } })}>
        {text}
      </Static>
    );
  }

  // Words split into tokens, each character a span. Whitespace preserved as
  // its own non-animated span so wrapping behaves correctly.
  const words = text.split(/(\s+)/);

  return (
    <Component
      className={className}
      style={serif ? { fontStyle: "italic" } : undefined}
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
