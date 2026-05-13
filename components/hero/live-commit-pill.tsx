"use client";

/**
 * LiveCommitPill — DESIGN.md §5.1
 * Shows the user's most recent public push event across ALL repos.
 *  - Green pulse dot
 *  - Repo name + first 60 chars of commit message
 *  - Relative time (updates client-side every 60s)
 * Empty state: "Building privately right now" with a neutral dot.
 */

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/time";
import type { PushEvent } from "@/lib/github";

type Props = {
  event: PushEvent | null;
};

const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export function LiveCommitPill({ event }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!event) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [event]);

  if (!event) {
    return (
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-subtle bg-bg-card/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-tertiary backdrop-blur">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fg-tertiary" />
        Building privately right now
      </span>
    );
  }

  const repoShort = event.repo.split("/").pop() ?? event.repo;

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View commit"
      className="group inline-flex max-w-full items-center gap-2 rounded-full border border-signal-live/40 bg-signal-live/10 px-3 py-1.5 font-mono text-[11px] text-fg-primary backdrop-blur transition-colors hover:border-signal-live/70"
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-live" />
        <span className="relative h-2 w-2 rounded-full bg-signal-live" />
      </span>
      <span className="uppercase tracking-wider text-signal-live">Shipping</span>
      <span className="hidden truncate text-fg-secondary sm:inline" title={event.message}>
        {repoShort} · "{trim(event.message, 50)}"
      </span>
      <span className="truncate text-fg-secondary sm:hidden" title={event.message}>
        {repoShort}
      </span>
      <span className="flex-shrink-0 text-fg-tertiary">· {formatRelativeTime(event.createdAt, now)}</span>
    </a>
  );
}
