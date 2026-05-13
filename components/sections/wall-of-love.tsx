"use client";

/**
 * WallOfLove — DESIGN.md §5.7 (rev v2.1)
 * Two-row marquee in opposing directions. Slower (80s vs 40s). Clean -50%
 * keyframe (fixes the visible snap at end). Cards sized to fit content
 * naturally (no line-clamp).
 *
 * On hover (desktop), a fixed-position popover appears with the full
 * recommendation text — marquee pauses anyway. No inline card growth.
 *
 * Profile photo: real JPG when present, gradient initials fallback.
 * Company logo: small overlay next to name when present.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
  const [active, setActive] = useState<Recommendation | null>(null);
  const reduced = useReducedMotion();

  if (RECS.length === 0) return null;

  // Split for opposing rows.
  const half = Math.ceil(RECS.length / 2);
  const rowA = RECS.slice(0, half);
  const rowB = RECS.slice(half);

  return (
    <section
      id="recommendations"
      className="relative overflow-hidden bg-bg-base px-0 py-24 lg:py-32"
    >
      <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          Wall of love · {RECS.length}
        </div>
        <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
          What people I've worked with say.
        </h2>
        <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
          Hover any card for the full recommendation.
        </p>
      </div>

      <div className="group/wall flex flex-col gap-4">
        <MarqueeRow recs={rowA} direction="left" reduced={!!reduced} onHover={setActive} />
        <MarqueeRow recs={rowB} direction="right" reduced={!!reduced} onHover={setActive} />
      </div>

      <RecommendationPopover rec={active} onClose={() => setActive(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function MarqueeRow({
  recs,
  direction,
  reduced,
  onHover,
}: {
  recs: Recommendation[];
  direction: "left" | "right";
  reduced: boolean;
  onHover: (rec: Recommendation | null) => void;
}) {
  // -50% clean keyframe — list is rendered EXACTLY twice with no gap between
  // the two siblings.
  const animClass = reduced
    ? ""
    : direction === "left"
    ? "animate-marquee-clean-slow"
    : "animate-marquee-clean-slow-reverse";

  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div className={`flex shrink-0 items-stretch gap-4 pr-4 ${animClass} group-hover/wall:[animation-play-state:paused]`}>
        {recs.map((rec) => (
          <RecommendationCard key={`a-${rec.slug}`} rec={rec} onHover={onHover} />
        ))}
      </div>
      <div className={`flex shrink-0 items-stretch gap-4 pr-4 ${animClass} group-hover/wall:[animation-play-state:paused]`} aria-hidden>
        {recs.map((rec) => (
          <RecommendationCard key={`b-${rec.slug}`} rec={rec} onHover={onHover} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function RecommendationCard({
  rec,
  onHover,
}: {
  rec: Recommendation;
  onHover: (rec: Recommendation | null) => void;
}) {
  const [photoOk, setPhotoOk] = useState(true);
  const [logoOk, setLogoOk] = useState(true);

  return (
    <article
      onMouseEnter={() => onHover(rec)}
      onMouseLeave={() => onHover(null)}
      className="flex w-[420px] min-w-[420px] flex-col rounded-3xl border border-border-subtle bg-bg-card/70 p-6 backdrop-blur-sm transition-colors hover:border-border-strong md:w-[500px] md:min-w-[500px]"
    >
      <Quote className="h-5 w-5 flex-shrink-0 text-brand-magenta" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-fg-secondary md:text-base">
        {rec.shortQuote || rec.fullText}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
        {/* Avatar */}
        {rec.photo && photoOk ? (
          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-border-strong">
            <Image
              src={rec.photo}
              alt={rec.photoAlt || rec.name}
              fill
              sizes="44px"
              className="object-cover"
              onError={() => setPhotoOk(false)}
            />
          </div>
        ) : (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-sm font-semibold text-white">
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

        {/* Company logo small thumbnail */}
        {rec.companyLogo && logoOk ? (
          <div
            className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-md bg-white/95 p-0.5"
            title={rec.company}
          >
            <Image
              src={rec.companyLogo}
              alt={rec.company}
              fill
              sizes="28px"
              className="object-contain"
              onError={() => setLogoOk(false)}
            />
          </div>
        ) : (
          <span
            className="truncate rounded-md bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-secondary"
            title={rec.company}
          >
            {rec.company.slice(0, 12)}
          </span>
        )}

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

/* -------------------------------------------------------------------------- */

function RecommendationPopover({
  rec,
  onClose,
}: {
  rec: Recommendation | null;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rec) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [rec, onClose]);

  if (!rec) return null;

  return (
    <div
      ref={popoverRef}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] mx-auto hidden max-w-2xl px-4 md:block"
    >
      <div className="pointer-events-auto rounded-3xl border border-border-strong bg-bg-elevated/95 p-6 shadow-[0_24px_60px_-20px_hsl(var(--brand-magenta)/0.4)] backdrop-blur">
        <div className="flex items-start gap-3 border-b border-border-subtle pb-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-magenta to-brand-violet text-sm font-semibold text-white">
            {rec.name
              .split(" ")
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="text-base font-semibold text-fg-primary">{rec.name}</div>
            <div className="font-mono text-xs text-fg-tertiary">
              {rec.designation} · {rec.company}
            </div>
          </div>
        </div>
        <p className="mt-4 max-h-[60vh] overflow-y-auto text-sm leading-relaxed text-fg-secondary">
          {rec.fullText}
        </p>
      </div>
    </div>
  );
}
