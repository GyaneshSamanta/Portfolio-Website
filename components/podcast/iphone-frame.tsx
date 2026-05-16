"use client";

/**
 * IPhoneFrame — bezel wrapper for YouTube Shorts.
 * 9:16 aspect ratio, rounded corners, dynamic island notch. Plays a
 * lite-youtube embed inside the screen area.
 */

import { LiteYouTube } from "@/components/ui/lite-youtube";

type Props = {
  videoId: string;
  title: string;
  /** Optional override for max-width (px). Default 280. */
  maxWidth?: number;
};

export function IPhoneFrame({ videoId, title, maxWidth = 280 }: Props) {
  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {/* Phone outer body — 9:16 to match YouTube Shorts native aspect */}
      <div className="relative aspect-[9/16] w-full rounded-[2.5rem] border border-border-strong bg-[#0a0a14] p-1.5 shadow-[0_24px_60px_-20px_hsl(var(--brand-magenta)/0.35)]">
        {/* Inner screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black">
          {/* Dynamic island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
          />

          {/* Video — fills the screen, cropped to 9:16. Use lite-youtube for
              lazy-load; before click it shows just the thumbnail. */}
          <div className="absolute inset-0">
            <LiteYouTube videoId={videoId} title={title} className="h-full w-full" />
          </div>
        </div>

        {/* Side button */}
        <div
          aria-hidden
          className="absolute -right-0.5 top-24 h-12 w-0.5 rounded-r bg-border-strong"
        />
        <div
          aria-hidden
          className="absolute -left-0.5 top-16 h-6 w-0.5 rounded-l bg-border-strong"
        />
        <div
          aria-hidden
          className="absolute -left-0.5 top-28 h-9 w-0.5 rounded-l bg-border-strong"
        />
        <div
          aria-hidden
          className="absolute -left-0.5 top-44 h-9 w-0.5 rounded-l bg-border-strong"
        />
      </div>
    </div>
  );
}
