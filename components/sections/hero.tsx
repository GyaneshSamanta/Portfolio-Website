"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import heroData from "@/data/hero.json";
import { useCountUp } from "@/hooks/useCountUp";

function StatBadge({ text, inView }: { text: string; inView: boolean }) {
  // Extract number and surrounding text: "20+ Hackathon Wins" → prefix="", num=20, suffix="+ Hackathon Wins"
  const match = text.match(/^(.*?)(\d[\d,]*)(.*?)$/);
  
  if (!match) {
    return (
      <span
        className="px-4 py-2 rounded-full text-sm font-semibold border"
        style={{
          borderColor: "hsl(300 61% 37% / 0.4)",
          color: "#E491C9",
          backgroundColor: "hsl(300 61% 37% / 0.12)",
        }}
      >
        {text}
      </span>
    );
  }

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3];
  const num = parseInt(numStr, 10);
  const count = useCountUp(num, 1500, inView);

  // Reformat with commas if original had them
  const formatted = match[2].includes(',') 
    ? count.toLocaleString()
    : count.toString();

  return (
    <span
      className="px-4 py-2 rounded-full text-sm font-semibold border tabular-nums"
      style={{
        borderColor: "hsl(300 61% 37% / 0.4)",
        color: "#E491C9",
        backgroundColor: "hsl(300 61% 37% / 0.12)",
      }}
    >
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function HeroSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const hero = heroData as any;
  const skills: string[] = hero.skills || [];
  const badges: string[] = hero.badges || [];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="snap-section section-dark flex flex-col justify-center px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto relative"
    >
      {/* Name — center-aligned, visible without scroll */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-bold tracking-tighter leading-[0.9]">
          <span className="text-brand-gradient">{hero.nameFirst || "Gyanesh"}</span>
          <br />
          <span className="text-brand-gradient">{hero.nameLast || "Samanta"}</span>
        </h1>
      </motion.div>

      {/* Two-column layout: Text Left + Headshot Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Bio + Skill Tags + CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 order-2 md:order-1"
        >
          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium" style={{ color: "hsl(0 18% 93% / 0.85)" }}>
            {hero.subheadline || "I think in systems. I build in products. I write about both."}
          </p>

          {/* Animated Stats Badges — Enhancement 11.3 */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {badges.map((badge: string, idx: number) => (
                <StatBadge key={idx} text={badge} inView={inView} />
              ))}
            </div>
          )}

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2.5 mt-2">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 cursor-default"
                style={{
                  borderColor: "hsl(300 61% 37% / 0.3)",
                  color: "hsl(318 60% 73%)",
                  backgroundColor: "hsl(300 61% 37% / 0.08)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button
              data-cal-link="gyanesh-samanta/15min"
              data-cal-namespace="15min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-base transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #982598 0%, #E491C9 100%)",
                color: "#F1E9E9",
              }}
            >
              {hero.ctaPrimaryLabel || "Book a Call"}
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Right: Headshot */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[3/4] max-h-[50vh] overflow-hidden group order-1 md:order-2"
        >
          <Image
            src={hero.heroImage || "/images/hero/headshot.png"}
            alt={hero.heroImageAlt || "Gyanesh Samanta"}
            fill
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
            priority
          />
          {/* Gradient overlay for blending into dark bg */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(238 47% 16%) 0%, transparent 30%), linear-gradient(to right, hsl(238 47% 16% / 0.3) 0%, transparent 20%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
