"use client";

/**
 * LiveCommitPill — DESIGN.md §5.1
 * "🟢 Shipping now — last commit Xm ago" — relative time updates client-side
 * every 60s. Empty state: "Building privately right now" (no green dot).
 */

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/time";

type Props = {
  /** ISO timestamp of the most recent push event, or null if none. */
  lastCommitAt: string | null;
};

export function LiveCommitPill({ lastCommitAt }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!lastCommitAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [lastCommitAt]);

  if (!lastCommitAt) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card/70 px-3 py-1 font-mono text-xs uppercase tracking-wider text-fg-tertiary backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-fg-tertiary" />
        Building privately right now
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-signal-live/40 bg-signal-live/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-fg-primary backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-live" />
        <span className="relative h-2 w-2 rounded-full bg-signal-live" />
      </span>
      Shipping now · last commit {formatRelativeTime(lastCommitAt, now)}
    </span>
  );
}
