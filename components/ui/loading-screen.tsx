"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    // Verris-style precise numerical loading counter
    const duration = 1500; // 1.5s total load animation
    const intervalTime = 15;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Add a slight delay at 100% before sliding up
        setTimeout(() => {
          setIsCounting(false);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isCounting && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-6xl md:text-8xl font-medium tracking-tighter text-foreground tabular-nums flex items-end gap-2"
            >
              {progress}
              <span className="text-2xl md:text-4xl text-muted-foreground font-light">%</span>
            </motion.div>
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
