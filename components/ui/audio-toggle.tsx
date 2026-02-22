"use client";

import { useAudio } from "@/components/layout/sound-provider";
import { motion } from "framer-motion";

export function AudioToggle() {
  const { isPlaying, toggleSound } = useAudio();

  return (
    <button
      onClick={toggleSound}
      className="relative flex items-center justify-center gap-[3px] w-10 h-10 rounded-full border border-border/50 bg-background/50 backdrop-blur-md hover:bg-secondary transition-colors group z-50 overflow-hidden"
      aria-label="Toggle background audio"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-foreground"
          initial={{ height: 4 }}
          animate={{
            height: isPlaying ? [4, 12, 4, 16, 4][i] : 4,
          }}
          transition={{
            duration: 0.8,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </button>
  );
}
