const fs = require("fs");

async function fetchStats() {
  try {
    const reposRes = await fetch("https://api.github.com/users/GyaneshSamanta/repos?sort=updated&per_page=15");
    const repos = await reposRes.json();
    
    // Sort by stars and avoid forks to find the top 5 distinct projects (beyond NotebookLM)
    const otherRepos = repos
      .filter(r => !r.fork && r.name !== "NotebookLM-for-Windows")
      .slice(0, 5)
      .map(r => ({
        title: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language
      }));
    
    // Fetch NotebookLM release downloads
    const releaseRes = await fetch("https://api.github.com/repos/GyaneshSamanta/NotebookLM-for-Windows/releases");
    const releases = await releaseRes.json();
    
    let totalDownloads = 0;
    if (Array.isArray(releases)) {
        releases.forEach(release => {
            release.assets.forEach(asset => totalDownloads += asset.download_count);
        });
    }

    fs.writeFileSync("github_data.json", JSON.stringify({ otherRepos, notebookLmDownloads: totalDownloads }, null, 2));
    console.log("Successfully extracted Github Data to github_data.json");
  } catch (err) {
    console.error("Error fetching github data:", err);
  }
}
fetchStats();
