"use client";

import { motion } from "framer-motion";
import skillsData from "@/data/skills.json";
import { Zap } from "lucide-react";

export function SkillsSection() {
  if (!skillsData || skillsData.length === 0) return null;

  return (
    <section className="snap-section section-dark py-24" id="skills">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Skills & Expertise
            </h2>
          </div>
          <p className="text-lg max-w-2xl font-medium" style={{ color: "hsl(318 60% 73% / 0.7)" }}>
            Technical and strategic competencies across data, AI, product, and engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillsData.map((category: any, catIndex: number) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="group"
            >
              <h3 className="text-lg font-bold mb-6 tracking-tight" style={{ color: "#E491C9" }}>
                {category.category}
              </h3>
              <div className="flex flex-col gap-3">
                {category.skills.map((skill: string, skillIndex: number) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                    style={{
                      borderColor: "hsl(300 61% 37% / 0.15)",
                      backgroundColor: "hsl(238 40% 20% / 0.5)",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium" style={{ color: "hsl(0 18% 93% / 0.85)" }}>
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
