import { HeroSection } from "@/components/sections/hero";
import { NowShippingSection } from "@/components/sections/now-shipping";
import { JourneySection } from "@/components/sections/journey";
import { SelectedWorkSection } from "@/components/sections/selected-work";
import { PublishedResearchSection } from "@/components/sections/published-research";
import { WritingSection } from "@/components/sections/writing";
import { PodcastSection } from "@/components/sections/podcast";
import { WallOfLoveSection } from "@/components/sections/wall-of-love";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NowShippingSection />
      <JourneySection />
      <SelectedWorkSection />
      <PublishedResearchSection />
      <WritingSection />
      <PodcastSection />
      <WallOfLoveSection />
      <ContactSection />
    </>
  );
}
