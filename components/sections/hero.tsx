/**
 * Hero — DESIGN.md §5.1
 * Server wrapper. No GitHub data fetched here — the heartbeat lives in the
 * Now Shipping section. Keeps the hero fast + free of network dependencies.
 */

import { HeroClient } from "./hero-client";
import heroData from "@/data/hero.json";

export function HeroSection() {
  return <HeroClient hero={heroData as any} />;
}
