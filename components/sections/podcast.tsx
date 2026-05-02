"use client";

/**
 * Podcast — DESIGN.md §5.6
 * Featured episode at top (16:9 lite-youtube). 3-col grid below. Each card
 * plays in-place via lite-youtube-embed. No friction-laden link-out.
 */

import { ArrowUpRight, Play } from "lucide-react";
import { LiteYouTube } from "@/components/ui/lite-youtube";
import videosData from "@/data/videos.json";

type Video = {
  id: string;
  title: string;
  description?: string;
  url: string;
  date: string;
  duration?: string;
  featured?: boolean;
};

export function PodcastSection() {
  const data = videosData as { channelUrl: string; youtube: Video[] };
  const videos = data.youtube ?? [];
  if (videos.length === 0) return null;

  const featured = videos.find((v) => v.featured) ?? videos[0];
  const rest = videos.filter((v) => v.id !== featured.id || v !== featured);

  return (
    <section
      id="podcast"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <Play className="h-3.5 w-3.5" />
              Podcast & video
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              Long-form, on tap.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Clicking play loads YouTube; the page stays light until then.
            </p>
          </div>
          {data.channelUrl && (
            <a
              href={data.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Channel"
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-card/50 px-5 py-2.5 text-sm font-semibold text-fg-primary transition-colors duration-200 ease-swift hover:border-border-glow hover:bg-bg-card-hover"
            >
              Visit channel
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </header>

        {/* Featured episode. */}
        <div className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40">
          <div className="aspect-video w-full">
            <LiteYouTube videoId={featured.id} title={featured.title} className="h-full w-full" />
          </div>
          <div className="p-6 md:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              Latest episode · {featured.date}
              {featured.duration && ` · ${featured.duration}`}
            </div>
            <h3 className="mt-3 text-2xl font-semibold leading-snug text-fg-primary md:text-3xl">
              {featured.title}
            </h3>
            {featured.description && (
              <p className="mt-2 max-w-[80ch] text-base text-fg-secondary md:text-lg">
                {featured.description}
              </p>
            )}
          </div>
        </div>

        {/* Episode grid. */}
        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((v, i) => (
              <article
                key={`${v.id}-${i}`}
                className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40"
              >
                <div className="aspect-video w-full">
                  <LiteYouTube videoId={v.id} title={v.title} className="h-full w-full" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
                    {v.date}
                    {v.duration && ` · ${v.duration}`}
                  </div>
                  <h4 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-fg-primary">
                    {v.title}
                  </h4>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
