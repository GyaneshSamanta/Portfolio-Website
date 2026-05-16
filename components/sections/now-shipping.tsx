/**
 * NowShipping — DESIGN.md §5.2 (rev v2.1)
 * Server component. Live signals only. Drops static repo tiles + release tile.
 *
 * Layout (desktop, 12-col):
 *   row 1: LiveCommitTile (6) | SnakeChart (6)
 *   row 2: NewsletterTile (12 wide, 1 tall)
 *   row 3: 4× ProofTile (3 each) — "Achievements at a glance"
 */

import { Activity } from "lucide-react";
import { getRecentPushEvents } from "@/lib/github";
import { LiveCommitTile } from "@/components/now-shipping/live-commit-tile";
import { SnakeChart } from "@/components/now-shipping/snake-chart";
import { ProofTile } from "@/components/now-shipping/proof-tile";
import { NewsletterTile } from "@/components/now-shipping/newsletter-tile";
import heroData from "@/data/hero.json";
import { getAllPosts } from "@/lib/blog";

const USERNAME = "GyaneshSamanta";

export async function NowShippingSection() {
  const events = await getRecentPushEvents(USERNAME);
  const badges = (heroData as any).badges as string[] | undefined;
  const featuredEssay = getAllPosts()[0] ?? null;

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

        {/* Row 1 — live commit + snake chart (6 + 6) */}
        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          <LiveCommitTile events={events} spanClass="lg:col-span-6" rowSpan="lg:row-span-1" />
          <SnakeChart spanClass="lg:col-span-6" rowSpan="lg:row-span-1" />
        </div>

        {/* Row 2 — wide newsletter tile */}
        {featuredEssay && (
          <div className="mt-3 md:mt-4">
            <NewsletterTile
              title={featuredEssay.title}
              date={featuredEssay.dateDisplay}
              url={`/blog/${featuredEssay.slug}`}
              coverImage={featuredEssay.cover}
              readTime={featuredEssay.readTime}
            />
          </div>
        )}

        {/* Row 3 — Achievements at a glance */}
        {badges && badges.length > 0 && (
          <div className="mt-12">
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
      </div>
    </section>
  );
}
