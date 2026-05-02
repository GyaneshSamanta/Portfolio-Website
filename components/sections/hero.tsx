/**
 * Hero — DESIGN.md §5.1
 * Server component: fetches the latest GitHub push event so the "Shipping now"
 * pill has real data on first paint. Renders a client child for kinetic motion.
 */

import { getRecentPushEvents } from "@/lib/github";
import { HeroClient } from "./hero-client";
import heroData from "@/data/hero.json";

export async function HeroSection() {
  const username = "GyaneshSamanta";
  const events = await getRecentPushEvents(username);
  const lastCommitAt = events[0]?.createdAt ?? null;

  return <HeroClient hero={heroData as any} lastCommitAt={lastCommitAt} />;
}
