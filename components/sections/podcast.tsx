/**
 * Podcast — DESIGN.md §5.6 (rev v2.5)
 *
 * Layout — single section, two halves:
 *   LEFT  (8 cols): featured long-form episode + 2-col grid of more episodes
 *   RIGHT (4 cols): single iPhone bezel auto-cycling through Shorts
 *
 * Mobile: stacks (long-form on top, shorts phone below).
 *
 * Data: fully dynamic via lib/youtube.ts (scrapes the playlist HTML server-side,
 * ISR 6h, no API key).
 */

import { ArrowUpRight, Play, Smartphone } from "lucide-react";
import { LiteYouTube } from "@/components/ui/lite-youtube";
import { ShortsPhone } from "@/components/podcast/shorts-phone";
import { getPlaylistVideos } from "@/lib/youtube";

const PLAYLIST_ID = "PLDmP2FTmWmITaid4WWbpfantPMnafuu0q";
const CHANNEL_URL = "https://www.youtube.com/channel/UCWga4RrqehgwPS-MUvT4w4g";
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

export async function PodcastSection() {
  const videos = await getPlaylistVideos(PLAYLIST_ID);
  const episodes = videos.filter((v) => !v.isShort);
  const shorts = videos.filter((v) => v.isShort);

  const featured = episodes[0];
  const restEpisodes = episodes.slice(1, 5);
  const hasAny = episodes.length > 0 || shorts.length > 0;

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
              Podcasts
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
              <span className="font-serif italic">Gyanesh on Product:</span> Podcasts
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Full episodes + bite-sized takes — auto-loaded from my YouTube playlist.
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

        {!hasAny && <PodcastEmptyState />}

        {hasAny && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT — long-form (8 cols on desktop) */}
            <div className="lg:col-span-8">
              {featured && <FeaturedEpisode video={featured} />}
              {restEpisodes.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {restEpisodes.map((v) => (
                    <EpisodeCard key={v.id} video={v} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — single shorts phone (4 cols on desktop) */}
            {shorts.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                    <Smartphone className="h-3.5 w-3.5" />
                    Shorts
                  </div>
                  <h3 className="mb-2 font-serif text-2xl italic leading-tight text-fg-primary md:text-3xl">
                    Gyanesh on YT Shorts
                  </h3>
                  <p className="mb-6 text-sm text-fg-secondary">
                    {shorts.length} bite-sized takes auto-rotating on a phone. Silent — tap to skip.
                  </p>
                  <ShortsPhone videoIds={shorts.map((s) => s.id)} />
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FeaturedEpisode({ video }: { video: Awaited<ReturnType<typeof getPlaylistVideos>>[number] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40">
      <div className="aspect-video w-full">
        <LiteYouTube videoId={video.id} title={video.title} className="block h-full w-full" />
      </div>
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          <span>Latest episode</span>
          {video.publishedText && (
            <>
              <span aria-hidden>·</span>
              <span>{video.publishedText}</span>
            </>
          )}
          {video.durationText && (
            <>
              <span aria-hidden>·</span>
              <span>{video.durationText}</span>
            </>
          )}
          {video.viewsText && (
            <>
              <span aria-hidden>·</span>
              <span>{video.viewsText}</span>
            </>
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-fg-primary md:text-2xl">
          {video.title}
        </h3>
      </div>
    </div>
  );
}

function EpisodeCard({ video }: { video: Awaited<ReturnType<typeof getPlaylistVideos>>[number] }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40">
      <div className="aspect-video w-full">
        <LiteYouTube videoId={video.id} title={video.title} className="block h-full w-full" />
      </div>
      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          {[video.publishedText, video.durationText].filter(Boolean).join(" · ")}
        </div>
        <h4 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-fg-primary">
          {video.title}
        </h4>
      </div>
    </article>
  );
}

function PodcastEmptyState() {
  return (
    <div className="overflow-hidden rounded-3xl border border-dashed border-border-subtle bg-bg-card/40 px-6 py-12 text-center md:py-16">
      <Play className="mx-auto h-8 w-8 text-fg-tertiary" />
      <p className="mt-4 font-serif text-2xl italic text-fg-primary">Episodes loading…</p>
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
