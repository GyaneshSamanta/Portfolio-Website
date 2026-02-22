"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";

export function RecommendationsSection() {
  return (
    <section className="py-24 px-4 md:px-12 bg-secondary/30 mt-12" id="recommendations">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Recommendations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            What leaders and peers say about working together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {extractedData.profile.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 md:p-10 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-8">
                <svg className="w-8 h-8 text-primary/20 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-foreground/80 leading-relaxed italic text-lg line-clamp-6 hover:line-clamp-none transition-all duration-300 cursor-ns-resize">
                  "{rec.text}"
                </p>
              </div>
              <div className="pt-6 border-t border-border/50">
                <p className="font-bold text-foreground">{rec.name}</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">{rec.designation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
