"use client";

/**
 * ReposMarquee — DESIGN.md §5.4 (rev v2.2)
 * Horizontal scrolling carousel of GitHub repo "chips". Replaces the
 * dumb-looking GitHub OG thumbnail grid. Each chip = repo name, language,
 * stars, last update — compact and dense, like skill marquee.
 *
 * Two rows scrolling in opposite directions. Pauses on hover. Clean -50%
 * keyframe so loop is seamless. Respects prefers-reduced-motion.
 */

import { Github, Star, GitFork } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Repo } from "@/lib/github";
import { formatRelativeTime } from "@/lib/time";

type Props = {
  repos: Repo[];
};

// Language → tiny accent color dot
const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Solidity: "#AA6746",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
};

export function ReposMarquee({ repos }: Props) {
  const reduced = useReducedMotion();
  if (!repos.length) return null;

  // Filter out the .github.io page repo + private-archive-like noise.
  const visible = repos
    .filter((r) => !r.name.toLowerCase().endsWith(".github.io"))
    .slice(0, 10);

  if (visible.length === 0) return null;

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-3">
        {visible.map((r) => (
          <RepoChip key={r.id} repo={r} />
        ))}
      </div>
    );
  }

  // Split for two rows — alternate items so each row has variety.
  const rowA = visible.filter((_, i) => i % 2 === 0);
  const rowB = visible.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-4">
      <Row repos={rowA} dir="left" />
      {rowB.length > 0 && <Row repos={rowB} dir="right" />}
    </div>
  );
}

function Row({ repos, dir }: { repos: Repo[]; dir: "left" | "right" }) {
  if (repos.length === 0) return null;
  const animClass =
    dir === "left" ? "animate-marquee-clean" : "animate-marquee-clean-reverse";

  return (
    <div className="group/row relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <ul
        className={`flex shrink-0 items-stretch gap-4 pr-4 ${animClass} group-hover/row:[animation-play-state:paused]`}
      >
        {repos.map((r, i) => (
          <li key={`a-${r.id}-${i}`}>
            <RepoChip repo={r} />
          </li>
        ))}
      </ul>
      <ul
        aria-hidden
        className={`flex shrink-0 items-stretch gap-4 pr-4 ${animClass} group-hover/row:[animation-play-state:paused]`}
      >
        {repos.map((r, i) => (
          <li key={`b-${r.id}-${i}`}>
            <RepoChip repo={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RepoChip({ repo }: { repo: Repo }) {
  const langColor =
    repo.language && LANG_COLOR[repo.language] ? LANG_COLOR[repo.language] : "#828397";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View repo"
      className="group flex h-full w-[300px] flex-col rounded-2xl border border-border-subtle bg-bg-card/60 px-5 py-4 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 md:w-[340px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          <Github className="h-3 w-3" />
          GyaneshSamanta
        </div>
        <span className="font-mono text-[10px] text-fg-tertiary">
          {formatRelativeTime(repo.updated_at)}
        </span>
      </div>

      <h4 className="mt-2 truncate text-base font-semibold text-fg-primary">
        {repo.name}
      </h4>
      {repo.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-fg-secondary">
          {repo.description}
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 pt-3 font-mono text-[11px] text-fg-tertiary">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}
