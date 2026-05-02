/**
 * NowShipping — DESIGN.md §5.2
 * Server component. Fetches all GitHub data in parallel, then renders the
 * bento. Refreshes per the per-endpoint ISR caches in lib/github.ts.
 */

import { Activity } from "lucide-react";
import {
  getRepos,
  getRecentPushEvents,
  getContributions,
  getLatestRelease,
} from "@/lib/github";
import { LiveCommitTile } from "@/components/now-shipping/live-commit-tile";
import { ContributionsHeatmap } from "@/components/now-shipping/contributions-heatmap";
import { RepoTile } from "@/components/now-shipping/repo-tile";
import { ReleaseTile } from "@/components/now-shipping/release-tile";
import { ProofTile } from "@/components/now-shipping/proof-tile";
import { NewsletterTile } from "@/components/now-shipping/newsletter-tile";
import heroData from "@/data/hero.json";
import writingData from "@/data/writing.json";

const USERNAME = "GyaneshSamanta";

export async function NowShippingSection() {
  // All four fetches in parallel — the slowest one bounds the page render.
  const [repos, events, contributions] = await Promise.all([
    getRepos(USERNAME),
    getRecentPushEvents(USERNAME),
    getContributions(USERNAME),
  ]);

  const topRepoNames = repos.slice(0, 3).map((r) => r.name);
  const release = topRepoNames.length
    ? await getLatestRelease(USERNAME, topRepoNames)
    : null;

  const latestEvent = events[0] ?? null;
  const featuredRepos = repos
    .filter((r) => !r.name.toLowerCase().endsWith(".github.io"))
    .slice(0, 2);
  const badges = (heroData as any).badges as string[] | undefined;
  const featuredEssay = (writingData as any[]).find((w) => w.featured) ?? (writingData as any[])[0];

  return (
    <section
      id="now-shipping"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <Activity className="h-3.5 w-3.5 text-signal-live" />
              Now shipping
            </div>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
              The site has a heartbeat.
            </h2>
            <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
              Live signals straight from my GitHub. If a tile feels stale, it's because I am.
            </p>
          </div>
        </header>

        {/* 12-col bento on desktop, single column on mobile. Spans are author-
            controlled per tile for visual rhythm. */}
        <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          <LiveCommitTile event={latestEvent} spanClass="lg:col-span-5" rowSpan="lg:row-span-2" />
          <ContributionsHeatmap data={contributions} spanClass="lg:col-span-7" rowSpan="lg:row-span-2" />

          {featuredRepos[0] && (
            <RepoTile repo={featuredRepos[0]} spanClass="lg:col-span-3" />
          )}
          {featuredRepos[1] && (
            <RepoTile repo={featuredRepos[1]} spanClass="lg:col-span-3" />
          )}
          {release ? (
            <ReleaseTile release={release} spanClass="lg:col-span-3" />
          ) : (
            featuredRepos[2] && <RepoTile repo={featuredRepos[2]} spanClass="lg:col-span-3" />
          )}
          {featuredEssay && (
            <NewsletterTile
              title={featuredEssay.title}
              date={featuredEssay.date}
              url={featuredEssay.url}
              coverImage={featuredEssay.coverImage}
              readTime={featuredEssay.readTime}
              spanClass="lg:col-span-3"
            />
          )}

          {badges?.map((b) => (
            <ProofTile key={b} text={b} spanClass="lg:col-span-4" />
          ))}
        </div>
      </div>
    </section>
  );
}
