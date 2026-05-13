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
  const latestPushEvent = events[0] ?? null;

  return <HeroClient hero={heroData as any} latestPushEvent={latestPushEvent} />;
}
