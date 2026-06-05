"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, X, ArrowUpRight, Award, Briefcase, GraduationCap, Code } from "lucide-react";
import Image from "next/image";
import journeyData from "@/data/journey.json";
import { cn } from "@/lib/utils";

type Milestone = {
  id: string;
  year: string;
  type: "education" | "role" | "internship" | "milestone";
  org: string;
  title: string;
  dates: string;
  logo?: string;
  shipped: string;
  description?: string;
  location?: string;
  tags: string[];
  color: "purple" | "pink" | "violet" | "magenta";
};

const MILESTONES = journeyData as Milestone[];

const PHASES = [
  {
    id: "ml-engineer",
    num: "01",
    title: "Machine Learning Engineer",
    years: "2019 — 2022",
    transition: "Building the code foundation. Started with CS research and moved quickly from classical AI pipelines to engineering recommendation models, learning how to build features and structure real data, but realizing that the most interesting challenge wasn't just tuning weights, but understanding the user behaviour behind the predictions.",
    color: "violet" as const,
    icon: Code,
    orgs: ["srm-2019", "srm-iic-2020", "ischoolconnect-2022"],
  },
  {
    id: "data-scientist",
    num: "02",
    title: "Data Scientist",
    years: "2022 — 2023",
    transition: "Pivoting to telemetry. To bridge the gap between model outputs and user outcomes, I focused on data science—building analytics surfaces for creator networks and drone mapping payloads, learning to tell stories with numbers and design metrics for product decisions.",
    color: "pink" as const,
    icon: Award,
    orgs: ["tealfeed-2022", "tih-iot-2022"],
  },
  {
    id: "b2c-pm",
    num: "03",
    title: "Consumer (B2C) Product Manager",
    years: "2023 — 2026",
    transition: "Taking direct ownership. Self-transitioned to PM at Wall.app to shape questing-as-a-service, then scaled loyalty programs for millions of shoppers at Snapdeal, before diving into an MBA at XIMB to align technical telemetry with core business metrics.",
    color: "purple" as const,
    icon: Briefcase,
    orgs: ["wall-2023", "snapdeal-2023", "ximb-2024", "xsys-2024"],
  },
  {
    id: "b2b-pm",
    num: "04",
    title: "Enterprise (B2B) PM & AI Builder",
    years: "2025 — Present",
    transition: "Synthesizing AI and B2B systems. Bringing together engineering roots, user analytics, and MBA strategy to design Sterling OMS solutions for IBM enterprise deals and lead outbound AI products at the Ginesys CPO office.",
    color: "magenta" as const,
    icon: GraduationCap,
    orgs: ["ibm-2025", "hellopm-2026", "ginesys-2026", "ibm-apm-2026"],
  },
];

const TYPE_LABEL: Record<Milestone["type"], string> = {
  education: "Education",
  role: "Full-time",
  internship: "Internship",
  milestone: "Milestone",
};

const COLOR_HALO: Record<Milestone["color"], string> = {
  purple: "from-brand-purple/20 to-transparent",
  pink: "from-brand-pink/20 to-transparent",
  violet: "from-brand-violet/20 to-transparent",
  magenta: "from-brand-magenta/20 to-transparent",
};

export function JourneySection() {
  const [activePhase, setActivePhase] = useState("ml-engineer");
  const [openMilestone, setOpenMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePhase(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px", // triggers when element crosses near-center of viewport
      }
    );

    PHASES.forEach((phase) => {
      const el = document.getElementById(phase.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePhaseClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section
        id="journey"
        className="relative px-5 py-14 md:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-[1400px]">
          <header className="mb-12 text-center lg:text-left">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              The Journey
            </div>
            <h2 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-display text-fg-primary">
              <span className="font-serif italic">A transition</span> through the craft.
            </h2>
            <p className="mt-3 max-w-[60ch] mx-auto lg:mx-0 text-base text-fg-secondary md:text-lg">
              The transition story: from coding model architectures to analyzing user cohorts, to owning B2C loyalty and B2B enterprise AI products.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            {/* LEFT — Sticky Phase Navigation (Desktop Only) */}
            <div className="hidden lg:block">
              <div className="sticky top-28 self-start">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
                  Transition Stages
                </h3>
                <div className="relative pl-6 mt-8">
                  {/* Continuous vertical timeline connector line */}
                  <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-border-subtle" />

                  {PHASES.map((phase) => {
                    const isActive = activePhase === phase.id;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => handlePhaseClick(phase.id)}
                        className="group relative flex items-start gap-4 mb-10 text-left last:mb-0 transition-colors w-full focus:outline-none"
                      >
                        {/* Dot indicator */}
                        <div
                          className={cn(
                            "absolute -left-[23px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bg-base border-2 transition-all duration-300",
                            isActive
                              ? "border-brand-magenta scale-125 shadow-[0_0_8px_hsl(var(--brand-magenta))]"
                              : "border-border-subtle group-hover:border-fg-tertiary"
                          )}
                        />

                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] tracking-widest text-fg-tertiary uppercase">
                            {phase.years}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-semibold transition-colors duration-300",
                              isActive ? "text-fg-primary" : "text-fg-tertiary group-hover:text-fg-secondary"
                            )}
                          >
                            {phase.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — Epoch Containers */}
            <div className="space-y-16">
              {PHASES.map((phase) => {
                const phaseMilestones = MILESTONES.filter((m) => phase.orgs.includes(m.id));
                const PhaseIcon = phase.icon;
                return (
                  <div
                    key={phase.id}
                    id={phase.id}
                    className="scroll-mt-28"
                  >
                    {/* Phase Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]",
                        phase.color === "purple" && "text-brand-purple",
                        phase.color === "pink" && "text-brand-pink",
                        phase.color === "violet" && "text-brand-violet",
                        phase.color === "magenta" && "text-brand-magenta"
                      )}>
                        <PhaseIcon className="h-4 w-4" />
                      </div>
                      <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                        Phase {phase.num} · {phase.years}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-headline text-fg-primary md:text-3xl">
                      {phase.title}
                    </h3>

                    {/* Transition narrative quote block */}
                    <div className="glass specular relative rounded-2xl border-0 p-5 mt-4 mb-6 bg-gradient-to-r from-bg-card/40 to-transparent">
                      {/* Ambient caustics glow on the left of transition text */}
                      <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl",
                        phase.color === "purple" && "bg-brand-purple",
                        phase.color === "pink" && "bg-brand-pink",
                        phase.color === "violet" && "bg-brand-violet",
                        phase.color === "magenta" && "bg-brand-magenta"
                      )} />
                      <p className="text-sm italic leading-relaxed text-fg-secondary pl-3">
                        &ldquo;{phase.transition}&rdquo;
                      </p>
                    </div>

                    {/* Cards vertical stack */}
                    <div className="relative pl-6 border-l border-dashed border-border-subtle space-y-8">
                      {phaseMilestones.map((m) => (
                        <div key={m.id} className="relative">
                          {/* Timeline Dot Marker */}
                          <div className="absolute -left-[31px] top-6 flex h-4 w-4 items-center justify-center rounded-full bg-bg-base">
                            <div className={cn(
                              "h-2.5 w-2.5 rounded-full border border-bg-base transition-colors duration-300",
                              m.color === "purple" && "bg-brand-purple shadow-[0_0_6px_hsl(var(--brand-purple))]",
                              m.color === "pink" && "bg-brand-pink shadow-[0_0_6px_hsl(var(--brand-pink))]",
                              m.color === "violet" && "bg-brand-violet shadow-[0_0_6px_hsl(var(--brand-violet))]",
                              m.color === "magenta" && "bg-brand-magenta shadow-[0_0_6px_hsl(var(--brand-magenta))]"
                            )} />
                          </div>

                          {/* Milestone Card */}
                          <button
                            type="button"
                            onClick={() => setOpenMilestone(m)}
                            data-cursor="View details"
                            className="group glass specular relative flex w-full flex-col overflow-hidden rounded-3xl border-0 p-5 text-left transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-[hsl(var(--glass-material-strong))] md:p-6"
                          >
                            {/* Color halo */}
                            <div className={cn(
                              "pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br opacity-40 blur-2xl",
                              COLOR_HALO[m.color]
                            )} />

                            <div className="relative z-10 flex items-start gap-4">
                              {/* Logo image or fallback letter */}
                              {m.logo ? (
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/95 ring-1 ring-border-subtle">
                                  <Image src={m.logo} alt="" fill sizes="48px" className="object-contain" />
                                </div>
                              ) : (
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-magenta to-brand-violet text-base font-semibold text-white">
                                  {m.org.charAt(0)}
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-tertiary">
                                  <span className="rounded-full bg-bg-card px-2 py-0.5 text-fg-secondary">
                                    {TYPE_LABEL[m.type]}
                                  </span>
                                  <span>·</span>
                                  <span>{m.dates}</span>
                                </div>
                                <h4 className="mt-1.5 text-sm font-semibold text-fg-secondary">
                                  {m.org}
                                </h4>
                              </div>
                            </div>

                            <h5 className="relative z-10 mt-4 text-lg font-bold leading-tight tracking-headline text-fg-primary md:text-xl">
                              {m.title}
                            </h5>

                            <p className="relative z-10 mt-2 text-sm leading-relaxed text-fg-secondary font-medium">
                              {m.shipped}
                            </p>

                            {m.description && (
                              <p className="relative z-10 mt-1.5 line-clamp-2 text-xs leading-relaxed text-fg-tertiary">
                                {m.description}
                              </p>
                            )}

                            <div className="relative z-10 mt-4 flex items-center justify-between pt-3 border-t border-white/[0.04] w-full">
                              <div className="flex flex-wrap gap-1">
                                {m.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full glass specular px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-fg-secondary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-fg-tertiary group-hover:text-fg-primary transition-colors">
                                Learn more
                                <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <MilestoneModal
        milestone={openMilestone}
        onClose={() => setOpenMilestone(null)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal detail view for individual milestones                                 */
/* -------------------------------------------------------------------------- */

function MilestoneModal({
  milestone,
  onClose,
}: {
  milestone: Milestone | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!milestone) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [milestone, onClose]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="milestone-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg-base/80 px-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl glass-strong specular border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] p-6 md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-cursor="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-fg-tertiary transition-all hover:bg-white/[0.08] hover:text-fg-primary z-[2]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              {milestone.logo ? (
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-white/95 ring-1 ring-border-subtle">
                  <Image src={milestone.logo} alt="" fill sizes="56px" className="object-contain" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-magenta to-brand-violet text-lg font-semibold text-white">
                  {milestone.org.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                  {milestone.year} · {milestone.dates}
                </div>
                <h3
                  id="milestone-title"
                  className="mt-1 text-2xl font-bold leading-tight tracking-headline text-fg-primary md:text-3xl"
                >
                  {milestone.title}
                </h3>
                <div className="mt-1 text-base text-fg-secondary">{milestone.org}</div>
              </div>
            </div>

            {milestone.location && (
              <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-fg-tertiary">
                <MapPin className="h-3.5 w-3.5" />
                {milestone.location}
              </div>
            )}

            <p className="mt-6 text-base leading-relaxed text-fg-secondary md:text-lg">
              {milestone.description ?? milestone.shipped}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full glass specular px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
