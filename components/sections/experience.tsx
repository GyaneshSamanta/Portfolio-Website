"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";
import newContent from "@/data/new_content.json";

export function ExperienceSection() {
  return (
    <section className="py-24 px-4 md:px-12 max-w-5xl mx-auto" id="journey">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Journey</h2>
        <p className="text-muted-foreground text-lg mb-8">
          The path that led to building at the intersection of AI and Product Strategy.
        </p>
      </motion.div>

      <div className="space-y-12 md:space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border/0 before:via-border/80 before:to-border/0">
        
        {/* Experience Roles */}
        {extractedData.profile.experience.map((exp, index) => (
          <div key={`exp-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm flex-none transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/5 relative z-10 text-primary">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/80 transition-colors duration-300 shadow-sm"
            >
              <div className="flex flex-col gap-1 mb-3">
                <h3 className="text-xl font-bold text-foreground">{exp.company}</h3>
                {exp.title && <p className="text-foreground/80 font-medium">{exp.title}</p>}
                {!exp.title && exp.roles && <p className="text-foreground/80 font-medium">{exp.roles[0].title}</p>}
                <time className="text-sm font-mono text-muted-foreground mt-1 block">
                  {exp.dates || (exp.roles && exp.roles[0].dates)}
                </time>
              </div>
              {(exp.details || (exp.roles && exp.roles[0].details)) && (
                <p className="text-muted-foreground/80 text-sm leading-relaxed">
                  {exp.details || (exp.roles && exp.roles[0].details)}
                </p>
              )}
            </motion.div>
          </div>
        ))}

        {/* Education Roles */}
        {newContent.education.map((edu, index) => (
          <div key={`edu-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm flex-none transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/5 relative z-10 text-primary">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/80 transition-colors duration-300 shadow-sm"
            >
              <div className="flex flex-col gap-1 mb-3">
                <h3 className="text-xl font-bold text-foreground">{edu.university}</h3>
                <p className="text-foreground/80 font-medium">{edu.degree}</p>
                <time className="text-sm font-mono text-muted-foreground mt-1 block">
                  {edu.dates}
                </time>
              </div>
              {edu.details && (
                <p className="text-muted-foreground/80 text-sm leading-relaxed">
                  {edu.details} {edu.grade && `| Grade: ${edu.grade}`}
                </p>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
