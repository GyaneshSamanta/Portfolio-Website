"use client";

/**
 * LiveCommitTile — DESIGN.md §5.2
 * Largest tile. Pulse dot + relative timestamp that updates every 60s.
 * Truncates the commit message to one line; full message in `title=`.
 */

import { useEffect, useState } from "react";
import { GitCommit } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";
import { formatRelativeTime } from "@/lib/time";
import type { PushEvent } from "@/lib/github";

type Props = {
  event: PushEvent | null;
  spanClass?: string;
  rowSpan?: string;
};

export function LiveCommitTile({ event, spanClass, rowSpan }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!event) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [event]);

  if (!event) {
    return (
      <BentoTile spanClass={spanClass} rowSpan={rowSpan}>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-tertiary">
          <GitCommit className="h-3.5 w-3.5" />
          Live commit
        </div>
        <p className="mt-auto text-fg-secondary">Building privately right now.</p>
      </BentoTile>
    );
  }

  return (
    <BentoTile
      href={event.url}
      external
      spanClass={spanClass}
      rowSpan={rowSpan}
      cursorLabel="View commit"
      showArrow
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-tertiary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-live" />
          <span className="relative h-2 w-2 rounded-full bg-signal-live" />
        </span>
        Shipping now · {formatRelativeTime(event.createdAt, now)}
      </div>
      <p
        className="mt-3 line-clamp-3 text-base font-medium text-fg-primary md:text-lg"
        title={event.message}
      >
        {event.message || "(no message)"}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-xs text-fg-tertiary">
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
          {event.repo}
        </span>
        {event.sha && <span>{event.sha}</span>}
        {event.commits > 1 && <span>· {event.commits} commits</span>}
      </div>
    </BentoTile>
  );
}
