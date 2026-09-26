"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useCountUp — Animated counter hook
 * Counts from 0 to `end` over `duration` ms when `inView` is true.
 * Uses ease-out for smooth deceleration.
 */
export function useCountUp(end: number, duration: number = 1500, inView: boolean = false) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return count;
}
