/**
 * SnakeChart — DESIGN.md §5.2 (added)
 * Embeds the animated GitHub contribution snake from the user's profile repo
 * (Platane/snk GitHub Action runs daily and commits the SVG to the `output`
 * branch of GyaneshSamanta/GyaneshSamanta).
 *
 * Uses a plain <img> tag (not next/image) to preserve the SMIL animation —
 * Next's image optimizer can strip animation primitives from SVGs.
 */

import { Activity } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";

const SVG_URL =
  "https://raw.githubusercontent.com/GyaneshSamanta/GyaneshSamanta/output/github-contribution-grid-snake-dark.svg";

type Props = {
  spanClass?: string;
  rowSpan?: string;
};

export function SnakeChart({ spanClass, rowSpan }: Props) {
  return (
    <BentoTile spanClass={spanClass} rowSpan={rowSpan} ariaLabel="GitHub contribution snake chart">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        <Activity className="h-3.5 w-3.5 text-signal-live" />
        Contributions · live
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SVG_URL}
          alt="GitHub contribution graph being consumed by an animated snake"
          className="h-auto w-full max-w-[760px]"
          loading="lazy"
        />
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
        Auto-rendered daily by Platane/snk · GyaneshSamanta/GyaneshSamanta
      </div>
    </BentoTile>
  );
}
