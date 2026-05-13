"use client";

/**
 * ProofTile — extracted from the hero badge row.
 * "20+ Hackathon Wins" → big number on top, label underneath. Counts up on
 * scroll-into-view (DESIGN.md PRD enhancement 11.3).
 */

import { useRef } from "react";
import { useInView } from "framer-motion";
import { BentoTile } from "@/components/ui/bento-tile";
import { useCountUp } from "@/hooks/useCountUp";

type Props = {
  text: string;
  spanClass?: string;
  rowSpan?: string;
};

export function ProofTile({ text, spanClass, rowSpan }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  // Split "20+ Hackathon Wins" into prefix / number / suffix.
  const match = text.match(/^(\D*)(\d[\d,]*)([\s\S]*)$/);
  const number = match ? parseInt(match[2].replace(/,/g, ""), 10) : null;
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const value = useCountUp(number ?? 0, 1500, inView);
  const formatted = match?.[2].includes(",")
    ? value.toLocaleString()
    : value.toString();

  return (
    <BentoTile spanClass={spanClass} rowSpan={rowSpan}>
      <div ref={ref} className="flex h-full flex-col justify-center py-2">
        {number !== null ? (
          <>
            <div className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-none tracking-tight text-fg-primary">
              {prefix}
              <span className="tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-pink">
                {formatted}
              </span>
              {suffix.match(/^[+×x]/)?.[0] ?? ""}
            </div>
            <div className="mt-2 text-sm text-fg-secondary">
              {suffix.replace(/^[+×x]\s*/, "")}
            </div>
          </>
        ) : (
          <div className="text-base text-fg-primary">{text}</div>
        )}
      </div>
    </BentoTile>
  );
}
