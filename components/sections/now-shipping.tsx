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

export function NowShippingSection() {
  const badges = (heroData as any).badges as string[] | undefined;

  return (
    <section
      id="now-shipping"
      className="relative bg-bg-base px-5 py-14 md:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Activity className="h-3.5 w-3.5 text-signal-live" />
            Now shipping
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
            <span className="font-serif italic">PM</span> who builds.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Live signals from my GitHub — receipts, not promises.
          </p>
        </header>

        {/* Achievement pills */}
        {badges && badges.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              Achievements at a glance
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {badges.map((b) => (
                <ProofTile key={b} text={b} />
              ))}
            </div>
          </div>
        )}

        {/* Snake contribution graph — framed, single tile, no oversize */}
        <div className="rounded-3xl border border-border-subtle bg-bg-card/40 p-5 backdrop-blur-sm md:p-7">
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
          <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
            Auto-rendered daily by Platane/snk
          </div>
        </div>
      </div>
    </section>
  );
}
