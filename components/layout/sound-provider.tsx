"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useSound from "use-sound";

type SoundContextType = {
  isPlaying: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const [playBgm, { stop: stopBgm, pause: pauseBgm }] = useSound("/sounds/Andrew-Applepie-Sweet-Tomorrow.mp3", { 
    volume: 0.05, // 5% – subtle background ambience
    loop: true,
  });

  useEffect(() => {
    setHasMounted(true);

    const handleInteraction = () => {
      setIsPlaying(p => {
        if (!p) {
          return true;
        }
        return p;
      });
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("scroll", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playBgm();
    } else {
      pauseBgm();
    }
    
    return () => {
      stopBgm();
    };
  }, [isPlaying, playBgm, pauseBgm, stopBgm]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <SoundContext.Provider value={{ isPlaying, toggleSound }}>
      {hasMounted ? children : null}
    </SoundContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within a SoundProvider");
  }
  return context;
}
