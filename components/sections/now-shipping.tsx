/**
 * NowShipping — DESIGN.md §5.2 (rev v2.6)
 * Server component. Live signals only.
 *
 * Layout (top-to-bottom):
 *   1. Achievements at a glance — 4 ProofTiles (counter pills)
 *   2. Snake contribution graph — full-width animated SVG
 *   3. Newsletter + YouTube — two side-by-side cards
 */

import { Activity } from "lucide-react";
import { SnakeChart } from "@/components/now-shipping/snake-chart";
import { ProofTile } from "@/components/now-shipping/proof-tile";
import { NewsletterTile } from "@/components/now-shipping/newsletter-tile";
import { YouTubeTile } from "@/components/now-shipping/youtube-tile";
import heroData from "@/data/hero.json";
import { getAllPosts } from "@/lib/blog";
import { getPlaylistVideos } from "@/lib/youtube";

const PLAYLIST_ID = "PLDmP2FTmWmITaid4WWbpfantPMnafuu0q";
const CHANNEL_URL = "https://www.youtube.com/channel/UCWga4RrqehgwPS-MUvT4w4g";

export async function NowShippingSection() {
  const badges = (heroData as any).badges as string[] | undefined;
  const featuredEssay = getAllPosts()[0] ?? null;
  const videos = await getPlaylistVideos(PLAYLIST_ID);
  const featuredVideo = videos.find((v) => !v.isShort) ?? videos[0] ?? null;

  return (
    <section
      id="now-shipping"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Activity className="h-3.5 w-3.5 text-signal-live" />
            Now shipping
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            <span className="font-serif italic">PM</span> who builds.
          </h2>
          <p className="mt-3 max-w-none text-base text-fg-secondary md:text-lg md:whitespace-nowrap">
            Live signals from my GitHub — no static portfolio theatre.
          </p>
        </header>

        {/* Row 1 — Achievements at a glance */}
        {badges && badges.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              Achievements at a glance
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {badges.map((b) => (
                <ProofTile key={b} text={b} />
              ))}
            </div>
          </div>
        )}

        {/* Row 2 — GitHub contribution snake (full-width) */}
        <div className="mb-6">
          <SnakeChart />
        </div>

        {/* Row 3 — Newsletter card + YouTube channel card (2-col) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {featuredEssay && (
            <NewsletterTile
              title={featuredEssay.title}
              date={featuredEssay.dateDisplay}
              url={`/blog/${featuredEssay.slug}`}
              coverImage={featuredEssay.cover}
              readTime={featuredEssay.readTime}
            />
          )}

          {featuredVideo ? (
            <YouTubeTile
              title={featuredVideo.title}
              channelUrl={CHANNEL_URL}
              videoUrl={`https://www.youtube.com/watch?v=${featuredVideo.id}`}
              thumbnail={featuredVideo.thumbnail}
              durationText={featuredVideo.durationText}
              publishedText={featuredVideo.publishedText}
              viewsText={featuredVideo.viewsText}
            />
          ) : (
            <YouTubeTile
              title="Gyanesh on Product — full playlist"
              channelUrl={CHANNEL_URL}
              videoUrl={CHANNEL_URL}
              thumbnail="/images/brand/newsletter-cover.png"
            />
          )}
        </div>
      </div>
    </section>
  );
}
