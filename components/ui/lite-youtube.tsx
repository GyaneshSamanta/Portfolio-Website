"use client";

/**
 * LiteYouTube — DESIGN.md §5.6
 * Wrapper for the `lite-youtube-embed` web component. Loads only a thumbnail
 * until clicked; on click, swaps in the real YouTube iframe. ~1KB at rest.
 *
 * Network-tab proof: no youtube.com requests fire on page load. The element
 * fetches its poster from img.youtube.com only.
 */

import { useEffect } from "react";
import "lite-youtube-embed/src/lite-yt-embed.css";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          videoid: string;
          videotitle?: string;
          params?: string;
          posterquality?: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
        },
        HTMLElement
      >;
    }
  }
}

type Props = {
  videoId: string;
  title: string;
  params?: string;
  className?: string;
};

export function LiteYouTube({ videoId, title, params, className }: Props) {
  useEffect(() => {
    // The package registers `<lite-youtube>` as a custom element on import.
    import("lite-youtube-embed");
  }, []);

  return (
    <lite-youtube
      videoid={videoId}
      videotitle={title}
      params={params}
      posterquality="maxresdefault"
      className={className}
    />
  );
}
