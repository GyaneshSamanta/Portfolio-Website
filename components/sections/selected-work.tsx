/**
 * SelectedWork — DESIGN.md §5.4 (rev v2.2)
 * Two-part structure:
 *   1. Open Source — horizontal marquee of GitHub repo chips (live from API)
 *   2. Research — 3 paper cards in a clean grid, each with a branded SVG cover
 *      + IEEE badge
 *
 * Removed the GitHub-OG-thumbnail tiles entirely (the user called them
 * "really dumb" — they were dominated by my avatar). The repo marquee is
 * dense, on-brand, and scrolls.
 */

import { Github, Layers, FileText } from "lucide-react";
import { getRepos } from "@/lib/github";
import { ReposMarquee } from "@/components/work/repos-marquee";
import { ResearchGrid } from "@/components/work/research-grid";

export async function SelectedWorkSection() {
  const repos = await getRepos("GyaneshSamanta");

  return (
    <section
      id="work"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Layers className="h-3.5 w-3.5" />
            Selected work
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            Things I'm <span className="font-serif italic">proud</span> of.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Open-source repos I keep alive, peer-reviewed research I've shipped to IEEE.
          </p>
        </header>

        {/* Sub-section 1: Open source repos */}
        <div className="mb-16">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Github className="h-3.5 w-3.5" />
            Open source · {repos.length} repos
          </div>
          <ReposMarquee repos={repos} />
        </div>

        {/* Sub-section 2: Research papers */}
        <div>
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <FileText className="h-3.5 w-3.5" />
            Research · 3 IEEE publications
          </div>
          <ResearchGrid />
        </div>
      </div>
    </section>
  );
}
