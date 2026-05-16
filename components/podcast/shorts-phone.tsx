"use client";

/**
 * ShortsPhone — DESIGN.md §5.6 (rev v2.5)
 *
 * Single iPhone bezel that auto-rotates through a list of YouTube Shorts.
 * Muted autoplay on each, advances to the next short every N seconds.
 * Tap the phone to advance manually.
 *
 * Why one phone instead of four:
 *  - The user wanted a focal moment, not a wall of phones.
 *  - Single iframe = much lighter on browser (1 YouTube embed at a time).
 *  - Feels like watching someone scroll Shorts on their phone.
 */

import { useEffect, useRef, useState } from "react";

type Props = {
  /** YouTube video IDs to cycle through. */
  videoIds: string[];
  /** ms per short before rotating. Default 18s — most shorts fully play in this. */
  rotateAfterMs?: number;
};

export function ShortsPhone({ videoIds, rotateAfterMs = 18000 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  // Start loading only when scrolled into view.
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            return;
          }
        }
        setVisible(false);
      },
      { rootMargin: "200px 0px", threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // Auto-rotate while visible.
  useEffect(() => {
    if (!visible || videoIds.length <= 1) return;
    const timer = window.setInterval(() => {
      setIdx((i) => (i + 1) % videoIds.length);
    }, rotateAfterMs);
    return () => window.clearInterval(timer);
  }, [visible, videoIds.length, rotateAfterMs]);

  if (videoIds.length === 0) return null;

  const currentId = videoIds[idx];
  const embedSrc = `https://www.youtube-nocookie.com/embed/${currentId}?autoplay=1&mute=1&loop=1&playlist=${currentId}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1`;
  const poster = `https://i.ytimg.com/vi/${currentId}/hqdefault.jpg`;

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[280px]"
      onClick={() => setIdx((i) => (i + 1) % videoIds.length)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIdx((i) => (i + 1) % videoIds.length);
        }
      }}
      aria-label="Tap to play next short"
    >
      {/* Phone outer body */}
      <div className="relative aspect-[9/16] w-full cursor-pointer rounded-[2.5rem] border border-border-strong bg-[#0a0a14] p-1.5 shadow-[0_24px_80px_-20px_hsl(var(--brand-magenta)/0.45)]">
        {/* Inner screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black">
          {/* Dynamic island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
          />

          {/* Video screen — phone is 9:16. YouTube embed is a 16:9 player.
              Inside that player a vertical Short (9:16 native) is centered with
              black bars left/right. To make the Short *fill* the 9:16 phone
              perfectly, we size the iframe to be 16:9 with HEIGHT matching the
              phone (so the iframe is 1.78× as wide as the phone) and center it
              horizontally — the centered 9:16 Short content then sits exactly
              within the phone bezel. No CSS transform needed. */}
          <div className="absolute inset-0 overflow-hidden">
            {visible ? (
              <iframe
                key={currentId}
                src={embedSrc}
                title={`Short ${idx + 1} of ${videoIds.length}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute top-0 border-0"
                style={{
                  /* 16/9 of phone width = 177.78% — iframe overflows left+right
                     by 39% each side. The Short content is centered within and
                     ends up exactly filling the phone width. */
                  width: "177.78%",
                  height: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                }}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={poster}
                alt=""
                className="absolute top-0 h-full object-cover"
                style={{
                  width: "177.78%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                loading="lazy"
              />
            )}
          </div>

          {/* Progress dots — tiny indicators at the top showing where we are
              in the shorts queue. */}
          {videoIds.length > 1 && (
            <div className="absolute left-1/2 top-9 z-10 flex -translate-x-1/2 gap-1">
              {videoIds.map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === idx ? "w-6 bg-white" : "w-3 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side buttons */}
        <div aria-hidden className="absolute -right-0.5 top-24 h-12 w-0.5 rounded-r bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-16 h-6 w-0.5 rounded-l bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-28 h-9 w-0.5 rounded-l bg-border-strong" />
        <div aria-hidden className="absolute -left-0.5 top-44 h-9 w-0.5 rounded-l bg-border-strong" />
      </div>

      {/* Caption beneath */}
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
        Tap to skip · {idx + 1} / {videoIds.length}
      </p>
    </div>
  );
}
