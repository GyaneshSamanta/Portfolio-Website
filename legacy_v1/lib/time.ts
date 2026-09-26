/**
 * Format an ISO timestamp as a short, "now-page" relative phrase.
 * Examples: "just now", "14m ago", "3h ago", "2d ago", "Mar 5".
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 30) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  const date = new Date(then);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
