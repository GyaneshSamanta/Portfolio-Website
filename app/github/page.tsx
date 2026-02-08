import { getRepos } from "@/lib/github";
import { GithubGrid } from "@/components/github-grid";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "GitHub",
  description: "My open source contributions and coding projects.",
};

export default async function GithubPage() {
  // Using "GyaneshSamanta" as the username based on earlier context
  const repos = await getRepos("GyaneshSamanta");

  return (
    <Section>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Engineering</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Exploring new technologies, building tools, and contributing to open source.
          </p>
        </div>
        
        <GithubGrid repos={repos} />
      </div>
    </Section>
  );
}
