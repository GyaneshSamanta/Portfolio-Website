import { Tag } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";
import { formatRelativeTime } from "@/lib/time";
import type { Release } from "@/lib/github";

export function ReleaseTile({
  release,
  spanClass,
  rowSpan,
}: {
  release: Release;
  spanClass?: string;
  rowSpan?: string;
}) {
  return (
    <BentoTile
      href={release.url}
      external
      spanClass={spanClass}
      rowSpan={rowSpan}
      cursorLabel="View release"
      showArrow
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-tertiary">
        <Tag className="h-3.5 w-3.5" />
        Latest release
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg-primary md:text-lg">
        {release.name}
      </h3>
      <div className="mt-auto flex items-center justify-between pt-4 font-mono text-xs text-fg-tertiary">
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
          {release.repo}
        </span>
        <span>{formatRelativeTime(release.publishedAt)}</span>
      </div>
    </BentoTile>
  );
}
