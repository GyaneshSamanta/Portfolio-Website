/**
 * GitHub API helpers — server-side fetches with ISR caching.
 * Public endpoints work without a token (60 req/hr); set GITHUB_TOKEN to lift
 * to 5,000/hr. The GraphQL contributions endpoint REQUIRES a token.
 */

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface PushEvent {
  repo: string;
  commits: number;
  message: string;
  sha: string;
  url: string;
  createdAt: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  total: number;
  weeks: ContributionWeek[];
}

export interface Release {
  repo: string;
  name: string;
  tagName: string;
  url: string;
  publishedAt: string;
}

const GH_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) {
  GH_HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

/** Total public repository count from the user's profile endpoint. */
export async function getPublicRepoCount(username: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: GH_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json.public_repos === "number" ? json.public_repos : null;
  } catch (err) {
    console.error("[github] getPublicRepoCount failed:", err);
    return null;
  }
}

export async function getRepos(username: string): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=9`,
      { headers: GH_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("[github] getRepos failed:", err);
    return [];
  }
}

interface GitHubEvent {
  type: string;
  repo: {
    name: string;
  };
  payload?: {
    commits?: {
      sha: string;
      message: string;
    }[];
  };
  created_at: string;
}

export async function getRecentPushEvents(username: string): Promise<PushEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=30`,
      { headers: GH_HEADERS, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const events = (await res.json()) as GitHubEvent[];
    return events
      .filter((e) => e.type === "PushEvent")
      .slice(0, 5)
      .map((e) => {
        const firstCommit = e.payload?.commits?.[0];
        return {
          repo: e.repo?.name ?? "unknown",
          commits: e.payload?.commits?.length ?? 0,
          message: firstCommit?.message?.split("\n")[0] ?? "",
          sha: firstCommit?.sha?.slice(0, 7) ?? "",
          url: firstCommit
            ? `https://github.com/${e.repo.name}/commit/${firstCommit.sha}`
            : `https://github.com/${e.repo?.name ?? ""}`,
          createdAt: e.created_at,
        } satisfies PushEvent;
      });
  } catch (err) {
    console.error("[github] getRecentPushEvents failed:", err);
    return [];
  }
}

/**
 * Contributions calendar via GraphQL. Returns null if no GITHUB_TOKEN is set
 * (the GraphQL endpoint always requires auth) so callers can fall back.
 */
export async function getContributions(username: string): Promise<ContributionData | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  const query = `query($user:String!) {
    user(login: $user) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        ...GH_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { user: username } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;

    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    interface GraphQLContributionDay {
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }
    interface GraphQLContributionWeek {
      contributionDays: GraphQLContributionDay[];
    }

    return {
      total: cal.totalContributions,
      weeks: (cal.weeks as GraphQLContributionWeek[]).map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: levelMap[d.contributionLevel] ?? 0,
        })),
      })),
    };
  } catch (err) {
    console.error("[github] getContributions failed:", err);
    return null;
  }
}

/**
 * Latest release across the user's repos. Returns the most recent release
 * found across the supplied repo names, or null if none have releases.
 */
export async function getLatestRelease(
  username: string,
  repoNames: string[]
): Promise<Release | null> {
  const releases = await Promise.all(
    repoNames.map(async (repo) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo}/releases/latest`,
          { headers: GH_HEADERS, next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const json = await res.json();
        return {
          repo,
          name: json.name || json.tag_name,
          tagName: json.tag_name,
          url: json.html_url,
          publishedAt: json.published_at,
        } satisfies Release;
      } catch {
        return null;
      }
    })
  );
  const valid = releases.filter((r): r is Release => r !== null);
  if (valid.length === 0) return null;
  valid.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return valid[0];
}
