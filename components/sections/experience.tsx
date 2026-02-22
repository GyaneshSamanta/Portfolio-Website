"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/timeline";

export function ExperienceSection() {
  return (
    <section className="py-24 px-4 md:px-12 max-w-[1400px] mx-auto w-full" id="journey">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Journey</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
          The path that led to building at the intersection of AI and Product Strategy.
        </p>
      </div>

      <Timeline />
    </section>
  );
}
