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
    <article className="group glass specular relative inline-block w-full break-inside-avoid overflow-hidden rounded-3xl border-0 p-6 transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))] md:p-7">
      {/* Brand-tinted top-right glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-magenta) / 0.5), transparent 70%)",
        }}
      />

      {/* Pronounced organization pill — sits ABOVE the quote so the reader's
          eye lands on the credential first. Logo (left) + company name. */}
      <div className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated/80 py-1 pl-1 pr-3.5">
        {rec.companyLogo && logoOk ? (
          <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-white/95">
            <Image
              src={rec.companyLogo}
              alt={rec.company}
              fill
              sizes="24px"
              className="object-contain p-0.5"
              onError={() => setLogoOk(false)}
            />
          </div>
        ) : (
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-[10px] font-semibold text-white">
            {rec.company.charAt(0)}
          </div>
        )}
        <span className="text-xs font-semibold text-fg-primary">{rec.company}</span>
      </div>

      <Quote className="relative z-10 h-6 w-6 flex-shrink-0 text-brand-magenta" aria-hidden />

      <p className="relative z-10 mt-3 text-[15px] leading-relaxed text-fg-secondary md:text-base">
        {rec.fullText}
      </p>

      <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-border-subtle pt-5">
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
