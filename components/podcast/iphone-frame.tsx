"use client";

/**
 * IPhoneFrame — DESIGN.md §5.6 (rev v2.3)
 *
 * 9:16 phone bezel for YouTube Shorts. Auto-plays muted and loops once the
 * frame scrolls into view (via IntersectionObserver). Sound is OFF by design
 * — feels like watching someone scroll Shorts.
 *
 * Why an IntersectionObserver gate? Browsers (esp. Safari iOS) refuse iframe
 * autoplay if too many off-screen iframes are loading at once. We lazy-load
 * each phone's iframe only when it's actually visible.
 */

import { useEffect, useRef, useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export function IPhoneFrame({ videoId, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // YouTube embed params:
  //  autoplay=1     — start automatically (works because mute=1)
  //  mute=1         — required for autoplay in browsers
  //  loop=1         — must be paired with playlist={id} to actually loop
  //  controls=0     — strip the YouTube chrome
  //  modestbranding=1, rel=0, playsinline=1 — clean playback
  //  disablekb=1    — no keyboard hijack
  const embedSrc = shouldLoad
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1`
    : "";

  // Static poster shown until the iframe is mounted.
  const poster = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div ref={ref} className="relative mx-auto w-full">
      {/* Phone outer body */}
      <div className="relative aspect-[9/16] w-full rounded-[2.5rem] border border-border-strong bg-[#0a0a14] p-1.5 shadow-[0_24px_60px_-20px_hsl(var(--brand-magenta)/0.35)]">
        {/* Inner screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black">
          {/* Dynamic island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
          />

          {/* Video screen */}
          <div className="absolute inset-0">
            {shouldLoad ? (
              <iframe
                src={embedSrc}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full border-0"
                // Crop the iframe so the 16:9 video fills the 9:16 frame as a
                // "vertical short". YouTube serves Shorts content correctly
                // when requested but the embed player uses 16:9 chrome. We
                // overscale + crop to fill.
                style={{
                  transform: "scale(1.8)",
                  transformOrigin: "center center",
                  pointerEvents: "none",
                }}
              />
            ) : (
              // Poster fallback while waiting for IntersectionObserver.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: "scale(1.8)" }}
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Side buttons */}
        <div aria-hidden className="absolute -right-0.5 top-24 h-12 w-0.5 rounded-r bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-16 h-6 w-0.5 rounded-l bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-28 h-9 w-0.5 rounded-l bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-44 h-9 w-0.5 rounded-l bg-border-strong" />
      </div>
    </div>
  );
}
