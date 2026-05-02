import { Star, GitFork, GitBranch } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";
import { formatRelativeTime } from "@/lib/time";
import type { Repo } from "@/lib/github";

type Props = {
  repo: Repo;
  spanClass?: string;
  rowSpan?: string;
};

export function RepoTile({ repo, spanClass, rowSpan }: Props) {
  return (
    <BentoTile
      href={repo.html_url}
      external
      spanClass={spanClass}
      rowSpan={rowSpan}
      cursorLabel="View repo"
      showArrow
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-tertiary">
        <GitBranch className="h-3.5 w-3.5" />
        Repo
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg-primary md:text-lg">{repo.name}</h3>
      {repo.description && (
        <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">{repo.description}</p>
      )}
      <div className="mt-auto flex items-center gap-3 pt-4 font-mono text-xs text-fg-tertiary">
        {repo.language && (
          <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-fg-secondary">
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
        <span className="ml-auto">{formatRelativeTime(repo.updated_at)}</span>
      </div>
    </BentoTile>
  );
}
