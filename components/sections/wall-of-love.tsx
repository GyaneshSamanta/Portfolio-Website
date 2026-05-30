"use client";

/**
 * WallOfLove — DESIGN.md §5.7 (rev v3.1 — Apple Liquid Glass + full text)
 *
 * Cards are sized to fit the FULL recommendation text. No truncation.
 * Layout: balanced CSS columns (3 on desktop, 2 on tablet, 1 on mobile) —
 * each card grows to its own natural height. break-inside-avoid keeps a
 * single recommendation from splitting across columns.
 *
 * Org credential sits as a refined chip in the card footer, INLINE with the
 * person's name + title — feels like a credential, not a pasted-on banner.
 */

import Image from "next/image";
import { useState } from "react";
import { Linkedin, Quote } from "lucide-react";
import recommendations from "@/data/recommendations.json";

type Recommendation = {
  slug: string;
  name: string;
  designation: string;
  company: string;
  companyLogo?: string;
  relationship: string;
  photo: string;
  photoAlt: string;
  linkedinUrl: string;
  shortQuote: string;
  fullText: string;
  date: string;
};

const RECS = recommendations as Recommendation[];

export function WallOfLoveSection() {
  if (RECS.length === 0) return null;

  return (
    <section
      id="recommendations"
      className="relative px-5 py-14 md:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            Wall of love · {RECS.length} recommendations
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
            What people I've <span className="font-serif italic">actually</span> worked with say.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Faculty who taught me, managers who shipped with me, peers who watched me build.
            Full quotes, no edits.
          </p>
        </header>

        {/* CSS columns masonry. Cards grow to fit full text — never truncated. */}
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>article]:mb-5">
          {RECS.map((rec) => (
            <RecommendationCard key={rec.slug} rec={rec} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [photoOk, setPhotoOk] = useState(true);
  const [logoOk, setLogoOk] = useState(true);

  return (
    <article className="group glass specular relative inline-block w-full break-inside-avoid overflow-hidden rounded-3xl border-0 p-6 transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))] md:p-7">
      {/* Brand-tinted top-right caustic */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.5), transparent 70%)",
        }}
      />

      {/* Quote glyph */}
      <Quote className="relative z-10 h-6 w-6 flex-shrink-0 text-brand-magenta" aria-hidden />

      {/* Full recommendation — never truncated */}
      <p className="relative z-10 mt-4 text-[15px] leading-relaxed text-fg-secondary md:text-base">
        {rec.fullText}
      </p>

      {/* Footer: avatar + name/title + org chip on the right */}
      <div className="relative z-10 mt-6 flex items-start gap-3 border-t border-border-subtle pt-5">
        {/* Avatar */}
        {rec.photo && photoOk ? (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-border-strong">
            <Image
              src={rec.photo}
              alt={rec.photoAlt || rec.name}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setPhotoOk(false)}
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-base font-semibold text-white">
            {rec.name
              .split(" ")
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")}
          </div>
        )}

        {/* Name + designation + org all in one column */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-fg-primary">{rec.name}</div>
          <div className="mt-0.5 text-[11px] text-fg-tertiary">
            {rec.designation}
          </div>

          {/* Org chip — refined, in-flow with the name block */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-elevated/80 py-0.5 pl-0.5 pr-2.5">
            {rec.companyLogo && logoOk ? (
              <div className="relative h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white/95">
                <Image
                  src={rec.companyLogo}
                  alt={rec.company}
                  fill
                  sizes="16px"
                  className="object-contain p-px"
                  onError={() => setLogoOk(false)}
                />
              </div>
            ) : (
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-[8px] font-semibold text-white">
                {rec.company.charAt(0)}
              </div>
            )}
            <span className="text-[11px] font-medium text-fg-primary">{rec.company}</span>
          </div>
        </div>

        {/* LinkedIn link top-right */}
        {rec.linkedinUrl && (
          <a
            href={rec.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="LinkedIn"
            aria-label={`${rec.name} on LinkedIn`}
            className="mt-0.5 flex-shrink-0 text-fg-tertiary transition-colors hover:text-fg-primary"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
