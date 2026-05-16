/**
 * YouTubeTile — Now Shipping (rev v2.6)
 *
 * Mirror of NewsletterTile but pointing to the YouTube channel + latest video.
 * Horizontal split on desktop (thumbnail left, copy right), stacked on mobile.
 */

import { ArrowUpRight, Play, Clock } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";

type Props = {
  title: string;
  channelUrl: string;
  videoUrl: string;
  thumbnail: string;
  durationText?: string | null;
  publishedText?: string | null;
  viewsText?: string | null;
  spanClass?: string;
  rowSpan?: string;
};

export function YouTubeTile({
  title,
  videoUrl,
  thumbnail,
  durationText,
  publishedText,
  viewsText,
  spanClass,
  rowSpan,
}: Props) {
  return (
    <BentoTile
      href={videoUrl}
      external
      spanClass={spanClass}
      rowSpan={rowSpan}
      cursorLabel="Watch"
      className="!p-0"
    >
      <div className="flex h-full flex-col md:flex-row">
        <div className="relative aspect-[16/9] flex-shrink-0 md:aspect-auto md:w-[42%] md:max-w-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-bg-base/30 transition-colors group-hover:bg-bg-base/15">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition-transform duration-200 ease-swift group-hover:scale-110">
              <Play className="h-4 w-4 translate-x-[1px] fill-current text-bg-base" />
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-card md:via-bg-card/40" />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Play className="h-3.5 w-3.5" />
            Latest from the channel
          </div>
          <h3 className="mt-3 line-clamp-3 max-w-[42ch] text-base font-semibold leading-snug text-fg-primary md:text-lg">
            {title}
          </h3>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 font-mono text-xs text-fg-tertiary">
            <span className="inline-flex items-center gap-3">
              {publishedText && <span>{publishedText}</span>}
              {durationText && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {durationText}
                  </span>
                </>
              )}
              {viewsText && (
                <>
                  <span aria-hidden>·</span>
                  <span>{viewsText}</span>
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-fg-secondary group-hover:text-fg-primary">
              Watch
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
