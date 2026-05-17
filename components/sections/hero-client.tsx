"use client";

/**
 * HeroClient — DESIGN.md §5.1 (rev v2.1)
 * - Kinetic "PM with T-shaped skills" headline (per-letter blur-in on highlight)
 * - Followed by static elaboration line "in Data Storytelling, Consumer Behaviour & AI."
 * - Verbatim LinkedIn About first paragraph as subheadline
 * - Dual CTA pills + headshot with live-commit pill
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { KineticHeading } from "@/components/kinetic-heading";
import { SkillMarquee } from "@/components/ui/skill-marquee";

type HeroData = {
  nameFirst: string;
  nameLast: string;
  headline: string;
  headlineHighlight: string;
  headlineFollowup?: string;
  subheadline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  heroImage: string;
  heroImageAlt: string;
  badges?: string[];
  skills?: string[];
};

type Props = {
  hero: HeroData;
};

export function HeroClient({ hero }: Props) {
  const reduced = useReducedMotion();
  const skills = hero.skills ?? [];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-bg-base px-5 pt-28 pb-12 md:px-8 lg:px-12 lg:pt-40 lg:pb-16"
    >
      {/* Atmospheric gradient wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(ellipse_at_top_right,hsl(var(--brand-magenta)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,hsl(var(--brand-violet)/0.15),transparent_55%)]"
      />

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:items-center">
        {/* LEFT — text */}
        <div className="order-2 lg:order-1">
          {/* Eyebrow: full name in mono caps, sits above the display heading.
              Smaller weight so it doesn't compete with the headline below. */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-fg-tertiary"
          >
            <span className="inline-block h-px w-6 bg-brand-magenta/60" aria-hidden />
            {hero.nameFirst} {hero.nameLast}
          </motion.div>

          {/* Display heading: "PM with" + kinetic italic "T-shaped skills" */}
          <h1 className="font-bold tracking-[-0.02em] leading-[0.95] text-[clamp(2.75rem,9vw,6.5rem)] text-fg-primary">
            {/* Line 1 — "PM with" with kinetic per-letter blur-in */}
            <KineticHeading text={hero.headline} as="span" delay={0} className="block" />
            {/* Line 2 — italic gradient phrase. Single element so the gradient
                actually paints. Reveal-on-mount via motion + opacity. */}
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block font-serif italic"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(var(--brand-magenta)) 0%, hsl(var(--brand-pink)) 35%, hsl(var(--brand-violet)) 70%, hsl(var(--brand-magenta)) 100%)",
                backgroundSize: "200% 100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                animation: reduced ? undefined : "gradient-flow 6s ease-in-out infinite",
              }}
            >
              {hero.headlineHighlight}
            </motion.span>
          </h1>

          {/* Followup line that ties the T-shape claim back to specifics. */}
          {hero.headlineFollowup && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[52ch] text-[clamp(1.1rem,2.5vw,1.5rem)] leading-snug tracking-[-0.005em] text-fg-secondary [text-wrap:balance]"
            >
              {hero.headlineFollowup}
            </motion.p>
          )}

          {/* Verbatim LinkedIn About paragraph. */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[60ch] text-base leading-relaxed text-fg-secondary md:text-lg"
          >
            {hero.subheadline}
          </motion.p>

          {/* Dual CTA. */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              data-cal-link="gyanesh-samanta/15min"
              data-cal-namespace="15min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
              data-cursor="Book a call"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_hsl(var(--brand-magenta)/0.6)] transition-transform duration-200 ease-swift hover:scale-[1.03]"
            >
              {hero.ctaPrimaryLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <a
              href={hero.ctaSecondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Read newsletter"
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong/60 bg-bg-card/40 px-6 py-3 text-sm font-semibold text-fg-primary backdrop-blur transition-colors duration-200 ease-swift hover:border-border-glow hover:bg-bg-card-hover/60"
            >
              {hero.ctaSecondaryLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        {/* RIGHT — headshot, immersive */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 mx-auto flex w-full max-w-[460px] flex-col items-center gap-5 lg:order-2"
        >
          {/* Atmospheric stage — photo dissolves into the page via radial mask.
              No hard card edge, no flat fill. The photo's own purple background
              extends as a glow that reads as ambient site atmosphere. */}
          <div className="relative w-full">
            {/* Aura — large soft brand glow behind the figure. Tinted to match
                the photo's purple wall so the two read as one. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-12 -z-[1] rounded-full opacity-80 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 35%, hsl(var(--brand-violet) / 0.55), transparent 70%), radial-gradient(ellipse 60% 50% at 30% 80%, hsl(var(--brand-magenta) / 0.35), transparent 70%)",
              }}
            />

            {/* Decorative orbital ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-[1] rounded-[3rem] border border-brand-magenta/15"
              style={{
                maskImage:
                  "radial-gradient(ellipse at center, black 0%, black 60%, transparent 95%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 0%, black 60%, transparent 95%)",
              }}
            />

            {/* Photo — masked to fade into page on the bottom edge so it
                doesn't read as "placed in a box". */}
            <div
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{
                maskImage:
                  "radial-gradient(ellipse 95% 95% at 50% 45%, black 0%, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 95% 95% at 50% 45%, black 0%, black 60%, transparent 100%)",
              }}
            >
              <Image
                src={hero.heroImage}
                alt={hero.heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 460px"
                className="object-cover"
              />
              {/* Subtle inner gradient — extra atmosphere from photo's own purple. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-base/85"
              />
            </div>

          </div>
        </motion.div>
      </div>

      {/* Skill marquee — multi-row at hero bottom. */}
      {skills.length > 0 && (
        <div className="mt-12 lg:mt-20">
          <SkillMarquee items={skills} />
        </div>
      )}
    </section>
  );
}
