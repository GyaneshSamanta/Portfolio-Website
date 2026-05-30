/**
 * SelectedWork — DESIGN.md §5.4 (rev v3.0 — Apple Liquid Glass pass)
 *
 * Three curated sub-sections, all sourced from data/projects.json (the user's
 * actual highlighted GitHub Profile README, not random recent pushes):
 *
 *   1. Hackathon wins (6) — each with award + event tag
 *   2. Open Source tools (2) — NotebookLM + Gemini for Windows w/ downloads
 *   3. Research & Analysis (3) — data analysis repos
 *
 * Published Research (IEEE) lives in the SEPARATE Research section (§5.4b).
 */

import { Github, Layers, Trophy, Download, ArrowUpRight, FileText } from "lucide-react";
import projects from "@/data/projects.json";

export function SelectedWorkSection() {
  return (
    <section
      id="work"
      className="relative px-5 py-14 md:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Layers className="h-3.5 w-3.5" />
            Selected work
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
            Things I'm <span className="font-serif italic">proud</span> of.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Hackathon wins, open-source tools shipped, and research I've spent time on.
            Curated, not exhaustive.
          </p>
        </header>

        {/* Sub-section A: Hackathon wins */}
        <div className="mb-14">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Trophy className="h-3.5 w-3.5 text-brand-magenta" />
            Hackathon wins · {projects.hackathonWins.length}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.hackathonWins.map((p) => (
              <HackathonCard key={p.slug} project={p} />
            ))}
          </div>
        </div>

        {/* Sub-section B: Open Source tools */}
        <div className="mb-14">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Github className="h-3.5 w-3.5" />
            Open source · {projects.openSource.length} tools
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.openSource.map((p) => (
              <OpenSourceCard key={p.slug} project={p} />
            ))}
          </div>
        </div>

        {/* Sub-section C: Research & Analysis */}
        <div>
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <FileText className="h-3.5 w-3.5" />
            Research & Analysis · {projects.research.length} repos
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {projects.research.map((p) => (
              <ResearchRepoCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type Hackathon = (typeof projects)["hackathonWins"][number];
type Repo = (typeof projects)["openSource"][number];
type ResearchRepo = (typeof projects)["research"][number];

function HackathonCard({ project }: { project: Hackathon }) {
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View repo"
      className="group glass specular relative flex h-full flex-col rounded-3xl border-0 p-6 transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))]"
    >
      {/* Award ribbon */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-magenta/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-magenta ring-1 ring-brand-magenta/30">
          <span>{project.trophy}</span>
          {project.award}
        </span>
        <ArrowUpRight className="h-4 w-4 text-fg-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
      </div>

      <h4 className="relative z-10 mt-4 text-lg font-semibold leading-tight tracking-headline text-fg-primary md:text-xl">
        {project.name}
      </h4>
      <p className="relative z-10 mt-2 line-clamp-3 text-sm leading-relaxed text-fg-secondary">
        {project.tagline}
      </p>

      <div className="relative z-10 mt-auto flex items-center gap-2 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
          {project.event}
        </span>
      </div>
    </a>
  );
}

function OpenSourceCard({ project }: { project: Repo }) {
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View repo"
      className="group glass specular relative flex h-full flex-col rounded-3xl border-0 p-6 transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))] md:p-7"
    >
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
          <Github className="h-3 w-3" />
          GyaneshSamanta
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-signal-live/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-signal-live ring-1 ring-signal-live/30">
          <Download className="h-3 w-3" />
          {project.downloads} downloads
        </span>
      </div>

      <h4 className="relative z-10 mt-4 text-xl font-semibold leading-tight tracking-headline text-fg-primary md:text-2xl">
        {project.name}
      </h4>
      <p className="relative z-10 mt-2 text-sm leading-relaxed text-fg-secondary md:text-base">
        {project.tagline}
      </p>

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-5">
        {project.techStack.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-elevated px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-secondary"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-fg-secondary group-hover:text-fg-primary">
          View on GitHub
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

function ResearchRepoCard({ project }: { project: ResearchRepo }) {
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View repo"
      className="group glass specular relative flex h-full flex-col rounded-3xl border-0 p-5 transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))]"
    >
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Repo
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
      </div>

      <h4 className="relative z-10 mt-3 text-base font-semibold leading-snug tracking-headline text-fg-primary">
        {project.name}
      </h4>
      <p className="relative z-10 mt-2 line-clamp-3 text-sm leading-relaxed text-fg-secondary">
        {project.tagline}
      </p>

      <div className="relative z-10 mt-auto flex flex-wrap gap-1.5 pt-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
