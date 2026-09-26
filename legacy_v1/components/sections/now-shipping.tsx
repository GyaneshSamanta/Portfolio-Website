/**
 * NowShipping — DESIGN.md §5.2 (rev v3.0 — Apple Liquid Glass pass)
 * Server component. Dense + focused — no repeats with later sections.
 *
 * Layout (top-to-bottom):
 *   1. Header
 *   2. 4 Achievement pills (counter tiles in a tight row)
 *   3. Snake contribution graph — compact, framed, centered
 *
 * Dropped from v2.6:
 *   - NewsletterTile (repeats Writing section directly below)
 *   - YouTubeTile (repeats Podcast section)
 *   - LiveCommitTile (snake graph already conveys the heartbeat)
 */

import { Activity, Github } from "lucide-react";
import { ProofTile } from "@/components/now-shipping/proof-tile";
import heroData from "@/data/hero.json";
import { type HeroData } from "./hero-client";

export function NowShippingSection() {
  const badges = (heroData as unknown as HeroData).badges;

  return (
    <section
      id="now-shipping"
      className="relative px-5 py-10 md:px-8 lg:px-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12 lg:items-start">
          {/* LEFT: Header + Achievements */}
          <div className="flex flex-col lg:pt-1">
            <header className="mb-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                <Activity className="h-3.5 w-3.5 text-signal-live" />
                Now shipping
              </div>
              <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
                <span className="font-serif italic">PM</span> who builds.
              </h2>
              <p className="mt-2 text-sm text-fg-secondary">
                Live signals from my GitHub — receipts, not promises.
              </p>
            </header>

            {/* Achievement pills in a compact 2x2 grid */}
            {badges && badges.length > 0 && (
              <div className="mt-2">
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
                  Achievements at a glance
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {badges.map((b) => (
                    <ProofTile key={b} text={b} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Snake contribution graph — framed in a sleek glass tile */}
          <div className="glass specular relative rounded-3xl border-0 p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <span className="inline-flex items-center gap-2">
                <Github className="h-3.5 w-3.5" />
                GitHub contributions · live
              </span>
              <a
                href="https://github.com/GyaneshSamanta"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View profile"
                className="text-fg-secondary transition-colors hover:text-fg-primary"
              >
                @GyaneshSamanta →
              </a>
            </div>
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/GyaneshSamanta/GyaneshSamanta/output/github-contribution-grid-snake-dark.svg"
                alt="GitHub contribution graph being consumed by an animated snake"
                loading="lazy"
                className="h-auto w-full max-w-[860px]"
              />
            </div>
            <div className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-fg-tertiary">
              Auto-rendered daily by Platane/snk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
