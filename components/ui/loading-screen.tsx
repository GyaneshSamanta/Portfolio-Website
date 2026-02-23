"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    const duration = 2000; // 2s total load animation
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsCounting(false);
        }, 400);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const padded = String(progress).padStart(3, "0");

  return (
    <>
      <AnimatePresence>
        {isCounting && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col justify-between"
            style={{ backgroundColor: "#15173D" }}
          >
            {/* Top row: decorative lines (left) + bio text (right) */}
            <div className="flex justify-between items-start p-8 md:p-12">
              {/* Decorative horizontal lines */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-1.5 w-56"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[2px] bg-white/30"
                    style={{ width: `${100 - i * 8}%` }}
                  />
                ))}
              </motion.div>

              {/* Bio text */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-right max-w-xs"
              >
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "#F1E9E9" }}>
                  Hey, I&apos;m Gyanesh Samanta, a Product
                  management professional based out of
                  India, I work at the intersection of Data,
                  Product and AI.
                </p>
              </motion.div>
            </div>

            {/* Center: rotating digit grid */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 gap-0 shadow-lg"
                style={{ transform: "rotate(-5deg)" }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-3xl md:text-5xl font-bold"
                    style={{
                      backgroundColor: i === 0 || i === 3 ? "rgba(152,37,152,0.15)" : "rgba(228,145,201,0.15)",
                      color: "#F1E9E9",
                    }}
                  >
                    <motion.span
                      animate={{ rotateX: [0, 360] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        ease: "easeInOut",
                        delay: i * 0.15,
                      }}
                      style={{ display: "inline-block" }}
                    >
                      0
                    </motion.span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom row: "Product Management" (left) + loading counter (right) */}
            <div className="flex justify-between items-end p-8 md:p-12">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm md:text-base font-medium tracking-wide"
                style={{ color: "#E491C9" }}
              >
                Product Management
              </motion.span>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="hidden md:block w-48 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(228,145,201,0.4))" }} />
                <span
                  className="text-sm md:text-base font-mono tabular-nums tracking-wide"
                  style={{ color: "#F1E9E9" }}
                >
                  Loading {padded}%
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isCounting ? 0 : 1, y: isCounting ? 30 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: isCounting ? 0 : 0.2 }}
        className={isCounting ? "h-screen overflow-hidden" : ""}
      >
        {children}
      </motion.div>
    </>
  );
}
