import { Timeline } from "@/components/timeline";
import { Section } from "@/components/ui/section";

export default function JourneyPage() {
  return (
    <Section>
      <div className="w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">My Journey</h1>
          <p className="text-xl text-muted-foreground">
            A timeline of my professional growth, key milestones, and the problems I&apos;ve solved along the way.
          </p>
        </div>
        
        <Timeline />
      </div>
    </Section>
  );
}
