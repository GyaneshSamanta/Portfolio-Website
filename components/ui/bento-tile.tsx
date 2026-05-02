/**
 * BentoTile — generic bento wrapper (DESIGN.md §3.4).
 * Translucent card with subtle border that brightens on hover. Optional
 * `href` makes the whole tile a link. `colSpan` / `rowSpan` are CSS span hints.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
  /** e.g. "md:col-span-8" — caller controls bento span. */
  spanClass?: string;
  /** e.g. "row-span-2" */
  rowSpan?: string;
  cursorLabel?: string;
  showArrow?: boolean;
  ariaLabel?: string;
};

const BASE_CLS =
  "group relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 p-5 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 md:p-6";

export function BentoTile({
  children,
  href,
  external,
  className = "",
  spanClass = "",
  rowSpan = "",
  cursorLabel,
  showArrow,
  ariaLabel,
}: Props) {
  const cls = `${BASE_CLS} ${spanClass} ${rowSpan} ${className}`.trim();

  const inner = (
    <>
      {children}
      {showArrow && (
        <ArrowUpRight
          aria-hidden
          className="absolute right-5 top-5 h-4 w-4 text-fg-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary"
        />
      )}
    </>
  );

  if (href) {
    if (external || /^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          data-cursor={cursorLabel}
          className={cls}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={ariaLabel} data-cursor={cursorLabel} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} data-cursor={cursorLabel} aria-label={ariaLabel}>
      {inner}
    </div>
  );
}
