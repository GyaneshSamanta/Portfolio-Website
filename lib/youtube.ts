/**
 * YouTube playlist fetcher — scrapes the public playlist page server-side and
 * extracts the embedded `ytInitialData` JSON. No API key required.
 *
 * Caching: Next.js ISR via `next: { revalidate: 21600 }` (6 hours) — the
 * portfolio re-fetches up to 4× per day automatically, plus on every deploy.
 *
 * Resilience: every property access is guarded. If YouTube changes its HTML
 * structure, the function returns `[]` and the section renders an empty state
 * rather than crashing.
 */

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  durationText: string | null;
  /** Parsed total seconds — used to split shorts from full episodes. */
  durationSeconds: number;
  /** Human-readable like "3 days ago" — directly from YouTube. */
  publishedText: string | null;
  /** Human-readable view count like "1.2K views". */
  viewsText: string | null;
  /** True if duration ≤ 90s — likely a YouTube Short. */
  isShort: boolean;
};

/**
 * Parse YouTube duration strings like "0:34" / "12:43" / "1:02:11" → seconds.
 * Returns 0 for unparseable input.
 */
function parseDuration(text: string | null | undefined): number {
  if (!text) return 0;
  const parts = text.split(":").map((p) => parseInt(p, 10));
  if (parts.some((p) => isNaN(p))) return 0;
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function getPlaylistVideos(playlistId: string): Promise<Video[]> {
  try {
    // hl=en + gl=US force the English playlist page; ucbcb=1 in the consent
    // cookie skips YouTube's consent interstitial (otherwise EU-region Vercel
    // builds get the "Accept all" wall instead of the playlist HTML).
    const res = await fetch(
      `https://www.youtube.com/playlist?list=${playlistId}&hl=en&gl=US`,
      {
        headers: {
          "User-Agent": UA,
          "Accept-Language": "en-US,en;q=0.9",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          // Consent cookie — bypass the "Before you continue to YouTube" gate.
          "Cookie": "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg",
        },
        next: { revalidate: 21600 },
      }
    );
    if (!res.ok) {
      console.warn(`[youtube] playlist fetch ${res.status} for ${playlistId}`);
      return [];
    }

    const html = await res.text();

    // The embedded JSON lives in a `var ytInitialData = {...};` declaration.
    // The match is non-greedy and bounded by the closing `;</script>`.
    const match = html.match(/var\s+ytInitialData\s*=\s*({[\s\S]+?});\s*<\/script>/);
    if (!match) {
      console.warn("[youtube] ytInitialData not found in HTML");
      return [];
    }

    let data: any;
    try {
      data = JSON.parse(match[1]);
    } catch (err) {
      console.warn("[youtube] failed to parse ytInitialData JSON", err);
      return [];
    }

    // Walk the tree. YouTube's structure: contents.twoColumnBrowseResultsRenderer
    //   .tabs[0].tabRenderer.content.sectionListRenderer
    //   .contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents
    const items =
      data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]
        ?.playlistVideoListRenderer?.contents;

    if (!Array.isArray(items)) {
      console.warn("[youtube] expected playlistVideoListRenderer.contents to be an array");
      return [];
    }

    const videos: Video[] = [];
    for (const wrap of items) {
      const r = wrap?.playlistVideoRenderer;
      if (!r) continue;

      const id: string | undefined = r.videoId;
      const title: string | undefined = r.title?.runs?.[0]?.text ?? r.title?.simpleText;
      if (!id || !title) continue;

      // Pick the highest-res thumbnail YouTube gave us.
      const thumbs: any[] = r.thumbnail?.thumbnails ?? [];
      const thumbnail =
        thumbs[thumbs.length - 1]?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      const durationText: string | null = r.lengthText?.simpleText ?? null;
      const durationSeconds = parseDuration(durationText);
      const isShort = durationSeconds > 0 && durationSeconds <= 90;

      // videoInfo.runs is usually [{ text: "1.2K views" }, { text: " • " }, { text: "3 days ago" }]
      const infoRuns: any[] = r.videoInfo?.runs ?? [];
      const viewsText: string | null = infoRuns?.[0]?.text ?? null;
      const publishedText: string | null = infoRuns?.[2]?.text ?? null;

      videos.push({
        id,
        title,
        thumbnail,
        durationText,
        durationSeconds,
        publishedText,
        viewsText,
        isShort,
      });
    }

    return videos;
  } catch (err) {
    console.error("[youtube] getPlaylistVideos failed:", err);
    return [];
  }
}
