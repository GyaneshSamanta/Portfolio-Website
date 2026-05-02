"use client";

/**
 * WallOfLove — DESIGN.md §5.7
 * Two-row marquee. Top row scrolls left; bottom row scrolls right (the
 * `marquee-reverse` keyframe). Hover anywhere → both rows pause.
 */

import Image from "next/image";
import { useState } from "react";
import { Linkedin, Quote } from "lucide-react";
import recommendations from "@/data/recommendations.json";

type Recommendation = {
  name: string;
  designation: string;
  company: string;
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

  // Split roughly in half for the two rows.
  const half = Math.ceil(RECS.length / 2);
  const rowA = RECS.slice(0, half);
  const rowB = RECS.slice(half).length > 0 ? RECS.slice(half) : RECS.slice(0, half).reverse();

  return (
    <section
      id="recommendations"
      className="relative overflow-hidden bg-bg-base px-0 py-24 lg:py-32"
    >
      <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          Wall of love
        </div>
        <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
          What people I've worked with say.
        </h2>
      </div>

      <div className="group/wall flex flex-col gap-4">
        <MarqueeRow recs={rowA} direction="left" />
        <MarqueeRow recs={rowB} direction="right" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function MarqueeRow({
  recs,
  direction,
}: {
  recs: Recommendation[];
  direction: "left" | "right";
}) {
  const animClass = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      {[0, 1].map((dup) => (
        <ul
          key={dup}
          aria-hidden={dup === 1}
          className={`flex shrink-0 items-stretch gap-4 pr-4 ${animClass} group-hover/wall:[animation-play-state:paused]`}
        >
          {recs.map((rec) => (
            <RecommendationCard key={`${dup}-${rec.name}`} rec={rec} />
          ))}
        </ul>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <li className="flex w-[340px] shrink-0 flex-col rounded-3xl border border-border-subtle bg-bg-card/70 p-5 backdrop-blur-sm md:w-[400px]">
      <Quote className="h-5 w-5 text-brand-magenta" aria-hidden />
      <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-fg-secondary md:text-base">
        {rec.shortQuote || rec.fullText}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
        {rec.photo && imgOk ? (
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-border-strong">
            <Image
              src={rec.photo}
              alt={rec.photoAlt || rec.name}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setImgOk(false)}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-sm font-semibold text-white">
            {rec.name.charAt(0)}
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
            className="text-fg-tertiary transition-colors hover:text-fg-primary"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
    </li>
  );
}
