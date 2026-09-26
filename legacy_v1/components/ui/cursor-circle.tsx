"use client";

/**
 * CursorCircle — DESIGN.md §6
 * Two-element cursor: a lagging ring with mix-blend-difference, plus a 1:1 dot.
 * Hides on coarse pointers, when window loses focus, and for keyboard users.
 * Reads optional data-cursor="<label>" on hovered elements to render a label.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "interactive" | "text";

export function CursorCircle() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [keyboardMode, setKeyboardMode] = useState(false);

  // Dot tracks 1:1; ring lags behind on a spring (§6.1).
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 30, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 30, mass: 0.5 });

  // Track if device has a fine pointer (skip on touch).
  const finePointerRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    finePointerRef.current = window.matchMedia("(pointer: fine)").matches;
    if (!finePointerRef.current) return;

    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);
    const handleBlur = () => setVisible(false);
    const handleFocus = () => setVisible(true);

    // Keyboard-mode detection: hide cursor when user is tabbing.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") setKeyboardMode(true);
    };
    const handleMouseDown = () => setKeyboardMode(false);

    // Variant + label resolution: walk up from the event target.
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, .interactive, [data-cursor]'
      );
      const textInput = target.closest('input[type="text"], input[type="email"], input[type="search"], textarea, [contenteditable="true"]');

      if (textInput) {
        setVariant("text");
      } else if (interactive) {
        setVariant("interactive");
      } else {
        setVariant("default");
      }

      const labelEl = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(labelEl?.dataset.cursor || null);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.body.addEventListener("mouseleave", handleLeave);
    document.body.addEventListener("mouseenter", handleEnter);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.body.removeEventListener("mouseleave", handleLeave);
      document.body.removeEventListener("mouseenter", handleEnter);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [dotX, dotY, visible]);

  if (!mounted || !finePointerRef.current || keyboardMode) return null;

  const ringScale = variant === "interactive" ? 2.5 : variant === "text" ? 0.6 : 1;
  const ringOpacity = visible ? 1 : 0;
  const dotOpacity = visible && variant !== "interactive" ? 1 : 0;

  return (
    <>
      {/* Ring — lagged, mix-blend-difference for visibility on any background. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white"
          style={{
            width: variant === "text" ? 4 : 32,
            height: variant === "text" ? 28 : 32,
            mixBlendMode: "difference",
            opacity: ringOpacity,
          }}
          animate={{ scale: ringScale }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {label && (
          <span
            className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-magenta px-3 py-1 text-xs font-medium text-white shadow-lg"
            style={{ opacity: ringOpacity }}
          >
            {label}
          </span>
        )}
      </motion.div>

      {/* Dot — 1:1 tracking, brand magenta. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1 w-1 rounded-full bg-brand-magenta md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: dotOpacity,
        }}
      />
    </>
  );
}
