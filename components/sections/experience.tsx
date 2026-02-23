"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/timeline";

export function ExperienceSection() {
  return (
    <section className="snap-section section-light py-24 px-4 md:px-12 lg:px-20 w-full" id="journey">
      <div className="mb-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Journey</h2>
          <p className="text-lg mb-8 max-w-2xl" style={{ color: "hsl(238 30% 40%)" }}>
            The path that led to building at the intersection of AI and Product Strategy.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <Timeline />
      </div>
    </section>
  );
}
