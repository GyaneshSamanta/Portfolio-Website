"use client";

import { InlineWidget } from "react-calendly";
import { useEffect, useState } from "react";

export function CalendlyWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[600px] w-full bg-secondary/5 rounded-xl animate-pulse" />;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-background">
      <InlineWidget
        url="https://calendly.com/gyanesh-samanta" // Placeholder URL
        styles={{ height: "600px", width: "100%" }}
        pageSettings={{
          backgroundColor: "0f172a", // Match background
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: "6d28d9", // Match primary
          textColor: "f8fafc", // Match foreground
        }}
      />
    </div>
  );
}
