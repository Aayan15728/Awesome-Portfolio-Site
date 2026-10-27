/**
 * When you last pushed to any of your public repos (forks excluded), for the footer's "last shipped" line.
 * Uses the repos list rather than the events feed, which only covers the last 90 days.
 * Cached for an hour. Set GITHUB_TOKEN to raise the API rate limit (optional; no scopes needed).
 */
export async function getLastPushAt(username: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 60 * 60 },
      }
    );
    if (!res.ok) return null;
    const repos = (await res.json()) as { fork: boolean; pushed_at: string | null }[];
    return repos.find((r) => !r.fork && r.pushed_at)?.pushed_at ?? null;
  } catch {
    return null;
  }
}
