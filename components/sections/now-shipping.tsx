/**
 * NowShipping — rev v3.3 (denser content per user feedback)
 *
 * Layout:
 *   Row 1: Header
 *   Row 2: 4 Achievement pills
 *   Row 3: Snake chart (left, 7 cols) + Live commit feed (right, 5 cols)
 *
 * The commit feed gives the section actual receipts — recent push events
 * with repo + sha + relative time. Pairs naturally with the snake graph
 * (both are live GitHub signals) and ends the "too much space, not enough
 * information" complaint from the user.
 */

import { Activity, Github, GitCommit, ArrowUpRight } from "lucide-react";
import { ProofTile } from "@/components/now-shipping/proof-tile";
import { getRecentPushEvents } from "@/lib/github";
import { formatRelativeTime } from "@/lib/time";
import heroData from "@/data/hero.json";

const USERNAME = "GyaneshSamanta";

export async function NowShippingSection() {
  const badges = (heroData as any).badges as string[] | undefined;
  const events = await getRecentPushEvents(USERNAME);
  const feed = events.slice(0, 5);

  return (
    <section
      id="now-shipping"
      className="relative px-5 py-14 md:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Activity className="h-3.5 w-3.5 text-signal-live" />
            Now shipping
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
            <span className="font-serif italic">PM</span> who builds.
          </h2>
          <p className="mt-2 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Live signals from my GitHub — receipts, not promises.
          </p>
        </header>

        {/* Achievement pills */}
        {badges && badges.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {badges.map((b) => (
              <ProofTile key={b} text={b} />
            ))}
          </div>
        )}

        {/* Snake (7 cols) + Commit feed (5 cols) */}
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-12">
          {/* Snake chart */}
          <div className="glass specular rounded-3xl p-5 md:p-6 lg:col-span-7">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <span className="inline-flex items-center gap-2">
                <Github className="h-3.5 w-3.5" />
                Contributions · live
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
            <div className="mt-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/GyaneshSamanta/GyaneshSamanta/output/github-contribution-grid-snake-dark.svg"
                alt="GitHub contribution graph being consumed by an animated snake"
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Live commit feed */}
          <div className="glass specular flex flex-col rounded-3xl p-5 md:p-6 lg:col-span-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-live" />
                <span className="relative h-2 w-2 rounded-full bg-signal-live" />
              </span>
              Last 5 pushes
            </div>

            {feed.length === 0 ? (
              <div className="mt-auto py-6 text-sm text-fg-secondary">
                Building privately right now.
              </div>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-border-subtle">
                {feed.map((e, i) => {
                  const repo = e.repo.split("/").pop() ?? e.repo;
                  const msg = (e.message || "").trim();
                  return (
                    <li key={`${e.sha}-${i}`}>
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="View commit"
                        className="group flex items-start gap-2.5 py-2.5 transition-colors hover:bg-bg-elevated/40"
                      >
                        <GitCommit className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-fg-tertiary" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-medium text-fg-primary">
                              {msg || `${e.commits || 1} new commit${(e.commits || 1) === 1 ? "" : "s"}`}
                            </span>
                            <span className="flex-shrink-0 font-mono text-[10px] text-fg-tertiary">
                              {formatRelativeTime(e.createdAt)}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
                            <span className="rounded-full bg-bg-elevated px-1.5 py-0.5 text-fg-secondary">
                              {repo}
                            </span>
                            {e.sha && <span>{e.sha}</span>}
                          </div>
                        </div>
                        <ArrowUpRight className="h-3 w-3 flex-shrink-0 text-fg-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
