"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";

export function RecommendationsSection() {
  // Duplicate array once for a seamless infinite loop
  const recommendations = [...extractedData.profile.recommendations, ...extractedData.profile.recommendations];

  return (
    <section className="py-24 bg-card/30 mt-12 overflow-hidden border-y border-border" id="recommendations">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Recommendations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            What leaders and peers say about working together.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex gap-8 whitespace-nowrap group-hover:[animation-play-state:paused] px-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="w-[400px] md:w-[500px] shrink-0 p-8 pt-12 rounded-none bg-background border border-border flex flex-col justify-between whitespace-normal"
            >
              <div className="mb-12">
                <svg className="w-8 h-8 text-brand/40 mb-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-foreground/90 leading-relaxed font-medium text-lg">
                  "{rec.text.length > 250 ? rec.text.slice(0, 250) + "..." : rec.text}"
                </p>
              </div>
              <div className="pt-6 border-t border-border mt-auto">
                <p className="font-bold text-foreground text-lg tracking-tight">{rec.name}</p>
                <p className="text-sm text-brand font-medium mt-1 truncate">{rec.designation}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
