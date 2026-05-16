"use client";

/**
 * WallOfLove — DESIGN.md §5.7 (rev v2.2 — masonry rebuild)
 *
 * Replaced the marquee + hover-popover pattern. The user explicitly asked for
 * "much bigger tiles, fit the entire recommendation there, I don't want these
 * smaller versions that have a semi full modal popping up at the bottom".
 *
 * New layout: CSS columns masonry, full recommendation per card, scrollable
 * naturally. Reading order: latest first. No truncation.
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
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            Wall of love · {RECS.length} recommendations
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            What people I've <span className="font-serif italic">actually</span> worked with say.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Faculty who taught me, managers who shipped with me, peers who watched me build.
            Full quotes, no edits.
          </p>
        </header>

        {/* CSS columns masonry — preserves natural reading order, balances card
            heights automatically. Single col on mobile, 2 on tablet, 3 on desktop. */}
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
    <article className="group relative inline-block w-full break-inside-avoid overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/70 p-6 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 md:p-7">
      {/* Brand-tinted top-right glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.5), transparent 70%)",
        }}
      />

      <Quote className="h-6 w-6 flex-shrink-0 text-brand-magenta" aria-hidden />

      <p className="mt-4 text-[15px] leading-relaxed text-fg-secondary md:text-base">
        {rec.fullText}
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-5">
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

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-fg-primary">{rec.name}</div>
          <div className="truncate font-mono text-[11px] text-fg-tertiary">
            {rec.designation}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {rec.companyLogo && logoOk && (
              <div className="relative h-3.5 w-3.5 flex-shrink-0 overflow-hidden rounded-sm bg-white/95 p-px">
                <Image
                  src={rec.companyLogo}
                  alt={rec.company}
                  fill
                  sizes="14px"
                  className="object-contain"
                  onError={() => setLogoOk(false)}
                />
              </div>
            )}
            <span className="truncate text-[11px] text-fg-secondary">{rec.company}</span>
          </div>
        </div>

        {rec.linkedinUrl && (
          <a
            href={rec.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="LinkedIn"
            aria-label={`${rec.name} on LinkedIn`}
            className="flex-shrink-0 text-fg-tertiary transition-colors hover:text-fg-primary"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
