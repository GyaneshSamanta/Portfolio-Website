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
      <div className="stacking-sections">
        <div className="section-pin">
          <HeroSection />
        </div>
        <div className="section-pin">
          <ExperienceSection />
        </div>
        <div className="section-pin">
          <ResearchSection />
        </div>
        <div className="section-pin">
          <ProjectsSection />
        </div>
        <div className="section-pin">
          <RecommendationsSection />
        </div>
        <div className="section-pin">
          <WritingSection />
        </div>
        <div className="section-pin">
          <ContactCTA />
        </div>
      </div>
    </>
  );
}
