/**
 * Podcast — DESIGN.md §5.6 (rev v2.1)
 * Server component. Fully dynamic: scrapes the YouTube playlist HTML at
 * request time via lib/youtube.ts (ISR 6h). No static array; no Rick Rolls.
 */

import { ArrowUpRight, Play } from "lucide-react";
import { LiteYouTube } from "@/components/ui/lite-youtube";
import { getPlaylistVideos } from "@/lib/youtube";

const PLAYLIST_ID = "PLDmP2FTmWmITaid4WWbpfantPMnafuu0q";
const CHANNEL_URL = "https://www.youtube.com/channel/UCWga4RrqehgwPS-MUvT4w4g";
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

export async function PodcastSection() {
  const videos = await getPlaylistVideos(PLAYLIST_ID);
  const hasVideos = videos.length > 0;
  const featured = videos[0];
  const rest = videos.slice(1, 7); // up to 6 more in grid

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
              Podcast
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              <span className="font-serif italic">Long-form,</span> on tap.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Episodes auto-load from my YouTube playlist. Click play, the iframe loads — until then the page stays light.
            </p>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Visit channel"
            className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-card/50 px-5 py-2.5 text-sm font-semibold text-fg-primary transition-colors duration-200 ease-swift hover:border-border-glow hover:bg-bg-card-hover"
          >
            Visit channel
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </header>

        {!hasVideos && <PodcastEmptyState />}

        {hasVideos && featured && (
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40">
            <div className="aspect-video w-full">
              <LiteYouTube videoId={featured.id} title={featured.title} className="h-full w-full" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                <span>Latest episode</span>
                {featured.publishedText && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{featured.publishedText}</span>
                  </>
                )}
                {featured.durationText && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{featured.durationText}</span>
                  </>
                )}
                {featured.viewsText && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{featured.viewsText}</span>
                  </>
                )}
              </div>
              <h3 className="mt-3 text-2xl font-semibold leading-snug text-fg-primary md:text-3xl">
                {featured.title}
              </h3>
            </div>
          </div>
        )}

        {hasVideos && rest.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((v) => (
              <article
                key={v.id}
                className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40"
              >
                <div className="aspect-video w-full">
                  <LiteYouTube videoId={v.id} title={v.title} className="h-full w-full" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
                    {[v.publishedText, v.durationText].filter(Boolean).join(" · ")}
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

function PodcastEmptyState() {
  return (
    <div className="overflow-hidden rounded-3xl border border-dashed border-border-subtle bg-bg-card/40 px-6 py-12 text-center md:py-16">
      <Play className="mx-auto h-8 w-8 text-fg-tertiary" />
      <p className="mt-4 font-serif text-2xl italic text-fg-primary">
        Episodes loading…
      </p>
      <p className="mt-2 text-sm text-fg-secondary">
        We refresh from YouTube every few hours. If this lingers, head over to the playlist directly.
      </p>
      <a
        href={PLAYLIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Open playlist"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-card/60 px-5 py-2.5 text-sm font-semibold text-fg-primary transition-colors duration-200 ease-swift hover:border-border-glow hover:bg-bg-card-hover"
      >
        Watch on YouTube
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}
