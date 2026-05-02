"use client";

/**
 * SkillMarquee — DESIGN.md §5.1
 * Horizontal infinite marquee of skill chips. Pauses on hover. Reuses the
 * `marquee` keyframe registered in tailwind.config.ts.
 */

type Props = {
  items: string[];
  className?: string;
};

export function SkillMarquee({ items, className }: Props) {
  if (!items?.length) return null;

  // We render the list twice so the loop is seamless. The translate distance
  // in the keyframe is `calc(-100% - 2rem)`, which assumes the gap matches.
  return (
    <div
      aria-label="Skills"
      className={`group/marquee relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className ?? ""}`}
    >
      {[0, 1].map((dup) => (
        <ul
          key={dup}
          aria-hidden={dup === 1}
          className="flex shrink-0 items-center gap-3 pr-3 animate-marquee group-hover/marquee:[animation-play-state:paused]"
        >
          {items.map((item) => (
            <li
              key={`${dup}-${item}`}
              className="rounded-full border border-border-subtle bg-bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-fg-secondary backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
