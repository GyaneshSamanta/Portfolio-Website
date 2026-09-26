/**
 * opengraph-image.tsx — Auto-generated Open Graph image for the site root.
 *
 * Next.js 14 App Router discovers this file and:
 *   - Generates the image at `/opengraph-image` (cached on Vercel edge)
 *   - Auto-injects <meta property="og:image"> + <meta name="twitter:image">
 *     pointing to it on the home route
 *
 * The image renders at 1200×630 (LinkedIn / Twitter / WhatsApp recommended).
 * Pure inline SVG-style JSX — no external assets fetched at edge runtime.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gyanesh Samanta — PM with T-shaped skills in Data Storytelling, Consumer Behaviour & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(237, 46, 186, 0.35), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(142, 61, 239, 0.35), transparent 55%), linear-gradient(135deg, #0A0820 0%, #11103A 60%, #1A1A3A 100%)",
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
            [120, 90, 1.8],
            [880, 60, 1.2],
            [1080, 140, 1.5],
            [320, 180, 1.0],
            [70, 380, 1.4],
            [1120, 460, 1.3],
            [220, 520, 1.1],
            [560, 80, 1.0],
            [780, 540, 1.6],
            [980, 320, 1.0],
            [430, 460, 1.2],
            [620, 380, 0.9],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#F5EFEF" opacity={0.7} />
          ))}
        </svg>

        {/* TOP — eyebrow + name */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
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
            }}
          >
            <span style={{ width: 32, height: 2, background: "#ED2EBA" }} />
            <span>Gyanesh Samanta · Portfolio</span>
          </div>
        </div>

        {/* MIDDLE — display headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 10,
            marginTop: -40,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              color: "#F5EFEF",
              display: "flex",
            }}
          >
            PM with
          </div>
          <div
            style={{
              fontSize: 110,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 0.95,
              fontFamily: '"Instrument Serif", "Iowan Old Style", serif',
              color: "#ED2EBA",
              display: "flex",
              marginTop: 4,
            }}
          >
            T-shaped skills.
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#C9BCC4",
              maxWidth: 900,
              marginTop: 24,
              display: "flex",
              lineHeight: 1.3,
            }}
          >
            in Data Storytelling, Consumer Behaviour & AI.
          </div>
        </div>

        {/* BOTTOM — proof badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              ["48", "Newsletter editions"],
              ["15+", "Hackathon wins"],
              ["3", "IEEE papers"],
              ["1000+", "Subscribers"],
            ].map(([num, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "12px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(237, 46, 186, 0.3)",
                  background: "rgba(26, 26, 58, 0.5)",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, color: "#ED2EBA", display: "flex" }}>
                  {num}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#828397",
                    fontFamily: '"Geist Mono", monospace',
                    marginTop: 4,
                    display: "flex",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
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
