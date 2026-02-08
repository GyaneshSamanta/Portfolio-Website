export interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export async function getRepos(username: string): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=9`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch repos");
    }

    const repos = await res.json();
    // Filter out forks if desired, or keep them.
    // return repos.filter((repo: any) => !repo.fork);
    return repos;
  } catch (error) {
    console.error("GitHub API Error:", error);
    return [];
  }
}
