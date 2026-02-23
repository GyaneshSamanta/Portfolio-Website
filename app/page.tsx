import { HeroSection } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ResearchSection } from "@/components/sections/research";
import { ProjectsSection } from "@/components/sections/projects";
import { RecommendationsSection } from "@/components/sections/recommendations";
import { WritingSection } from "@/components/sections/writing";
import { ContactCTA } from "@/components/contact-cta";
import { SectionNav } from "@/components/section-nav";

export default function Home() {
  return (
    <>
      <SectionNav />
      <HeroSection />
      <ExperienceSection />
      <ResearchSection />
      <ProjectsSection />
      <RecommendationsSection />
      <WritingSection />
      <ContactCTA />
    </>
  );
}
