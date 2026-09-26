/**
 * Per-post OG image for /blog/[slug].
 *
 * Next.js App Router discovers this co-located with page.tsx and auto-injects
 * `<meta property="og:image">` + `<meta name="twitter:image">` on each post
 * page pointing to /blog/<slug>/opengraph-image.
 *
 * Rendered at 1200×630 on Vercel Edge, cached per slug.
 *
 * IMPORTANT: We import the manifest JSON directly (not via lib/blog) so this
 * route doesn't pull in `fs` and can run on Edge runtime.
 */

import { ImageResponse } from "next/og";
import blogManifest from "@/data/blog.json";

export const runtime = "edge";
export const alt = "Gyanesh on Product — newsletter edition";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type PostMeta = {
  slug: string;
  title: string;
  dateDisplay: string;
  readTime: string;
};

const POSTS = blogManifest as PostMeta[];

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: { slug: string } };

export default function Image({ params }: Props) {
  const idx = POSTS.findIndex((p) => p.slug === params.slug);
  const post = idx >= 0 ? POSTS[idx] : null;
  const title = post?.title ?? "Gyanesh on Product";
  const dateDisplay = post?.dateDisplay ?? "";
  const readTime = post?.readTime ?? "";
  const editionLabel =
    idx >= 0
      ? `Edition #${String(POSTS.length - idx).padStart(2, "0")}`
      : "Newsletter";

  const lines = wrap(title, 28).slice(0, 4);
  const lineHeight = 78;
  const titleStartY = 290 - lines.length * (lineHeight / 2);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(237, 46, 186, 0.32), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(142, 61, 239, 0.32), transparent 55%), linear-gradient(135deg, #0A0820 0%, #11103A 60%, #1A1A3A 100%)",
          fontFamily: '"Inter", system-ui, sans-serif',
          color: "#F5EFEF",
          position: "relative",
        }}
      >
        {/* Decorative stars */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", inset: 0, opacity: 0.5 }}
        >
          {[
            [90, 70, 1.6],
            [870, 50, 1.2],
            [1100, 130, 1.5],
            [330, 170, 1.0],
            [60, 360, 1.4],
            [1130, 470, 1.3],
            [200, 510, 1.1],
            [560, 90, 1.0],
            [770, 530, 1.5],
            [990, 320, 1.0],
            [420, 460, 1.2],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#F5EFEF" opacity={0.7} />
          ))}
        </svg>

        {/* TOP — series eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 18,
            letterSpacing: 6,
            color: "#C9BCC4",
            textTransform: "uppercase",
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            position: "relative",
            zIndex: 10,
          }}
        >
          <span style={{ width: 32, height: 2, background: "#ED2EBA" }} />
          <span>Gyanesh on Product · {editionLabel}</span>
        </div>

        {/* MIDDLE — title in Instrument Serif italic */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: titleStartY,
            left: 70,
            right: 70,
            zIndex: 10,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 64,
                fontFamily: '"Instrument Serif", "Iowan Old Style", serif',
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
                color: "#F5EFEF",
                display: "flex",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* BOTTOM — meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {dateDisplay && (
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(237, 46, 186, 0.3)",
                  background: "rgba(26, 26, 58, 0.5)",
                  fontSize: 16,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#C9BCC4",
                  fontFamily: '"Geist Mono", monospace',
                }}
              >
                {dateDisplay}
              </div>
            )}
            {readTime && (
              <div
                style={{
                  fontSize: 16,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#828397",
                  fontFamily: '"Geist Mono", monospace',
                  display: "flex",
                }}
              >
                {readTime}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#828397",
              fontFamily: '"Geist Mono", monospace',
              display: "flex",
            }}
          >
            gyaneshsamanta.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (trial.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = trial;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
