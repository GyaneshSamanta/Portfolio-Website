"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Base background track requested by user
  const [playBgm, { stop: stopBgm }] = useSound("/sounds/Andrew-Applepie-Sweet-Tomorrow.mp3", { 
    volume: 0.2, // Keep background music subtle
    loop: true 
  });

  useEffect(() => {
    // Only start playing after user's first interaction with the document
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        playBgm();
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      stopBgm();
    };
  }, [hasInteracted, playBgm, stopBgm]);

  return <>{children}</>;
}
