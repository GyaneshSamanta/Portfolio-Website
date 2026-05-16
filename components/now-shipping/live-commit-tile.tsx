"use client";

/**
 * LiveCommitTile — DESIGN.md §5.2 (rev v2.4)
 *
 * Info-dense commit feed:
 *  - Header: pulse + "Last commit Xm ago" + total commits count in events
 *  - Body:   stack of up to 4 recent push events with repo, sha, message, time
 *  - Empty state: graceful "Building privately right now"
 *
 * Replaces the earlier single-message tile that often showed "(no message)"
 * because some recent commits are merge commits with empty subject lines.
 */

import { useEffect, useState } from "react";
import { GitCommit, ArrowUpRight } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";
import { formatRelativeTime } from "@/lib/time";
import type { PushEvent } from "@/lib/github";

type Props = {
  events: PushEvent[];
  spanClass?: string;
  rowSpan?: string;
};

const FEED_LIMIT = 4;

export function LiveCommitTile({ events, spanClass, rowSpan }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!events.length) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [events.length]);

  if (events.length === 0) {
    return (
      <BentoTile spanClass={spanClass} rowSpan={rowSpan}>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          <GitCommit className="h-3.5 w-3.5" />
          Live commits
        </div>
        <p className="mt-auto text-fg-secondary">Building privately right now.</p>
      </BentoTile>
    );
  }

  const latest = events[0];
  const feed = events.slice(0, FEED_LIMIT);
  const totalCommits = events.reduce((acc, e) => acc + (e.commits || 0), 0);

  return (
    <BentoTile
      spanClass={spanClass}
      rowSpan={rowSpan}
      ariaLabel="Recent GitHub commits"
    >
      {/* Header — pulse + relative timestamp + commit count */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-live" />
            <span className="relative h-2 w-2 rounded-full bg-signal-live" />
          </span>
          Shipping now · last commit {formatRelativeTime(latest.createdAt, now)}
        </span>
        <span>
          {totalCommits} commit{totalCommits === 1 ? "" : "s"} · {events.length} pushes
        </span>
      </div>

      {/* Commit feed */}
      <ul className="mt-5 flex flex-col divide-y divide-border-subtle">
        {feed.map((e, idx) => {
          const repo = e.repo.split("/").pop() ?? e.repo;
          const message = (e.message || "").trim();
          return (
            <li key={`${e.sha}-${idx}`}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View commit"
                className="group flex items-start gap-3 py-2.5 transition-colors hover:bg-bg-elevated/40"
              >
                <div className="mt-1 flex-shrink-0">
                  <GitCommit className="h-3.5 w-3.5 text-fg-tertiary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-fg-primary">
                      {message || `${e.commits || 1} new commit${(e.commits || 1) === 1 ? "" : "s"}`}
                    </span>
                    <span className="flex-shrink-0 font-mono text-[10px] text-fg-tertiary">
                      {formatRelativeTime(e.createdAt, now)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
                    <span className="rounded-full bg-bg-elevated px-1.5 py-0.5 text-fg-secondary">
                      {repo}
                    </span>
                    {e.sha && <span>{e.sha}</span>}
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-fg-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          );
        })}
      </ul>
    </BentoTile>
  );
}
