"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";

function RecCard({ rec }: { rec: { name: string; text: string; designation: string } }) {
  const isLong = rec.text.length > 200;
  const truncated = isLong ? rec.text.slice(0, 200) + "..." : rec.text;

  return (
    <div
      className="rec-card w-[350px] md:w-[460px] shrink-0 p-8 pt-10 rounded-2xl flex flex-col justify-between border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl cursor-default relative"
      style={{
        background: "linear-gradient(145deg, rgba(152,37,152,0.12) 0%, rgba(21,23,61,0.95) 60%)",
        borderColor: "hsl(300 61% 37% / 0.2)",
      }}
    >
      <div className="mb-8">
        <svg className="w-8 h-8 mb-6" style={{ color: "#E491C9" }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        {/* Truncated text: visible by default, hidden on hover */}
        <p className="rec-truncated leading-relaxed font-medium text-base md:text-lg" style={{ color: "hsl(0 18% 93% / 0.85)" }}>
          &ldquo;{truncated}&rdquo;
          {isLong && (
            <span className="block mt-2 text-sm font-semibold" style={{ color: "#E491C9" }}>
              Hover to read more →
            </span>
          )}
        </p>
        {/* Full text: hidden by default, visible on hover */}
        <p className="rec-full leading-relaxed font-medium text-base md:text-lg" style={{ color: "hsl(0 18% 93% / 0.85)" }}>
          &ldquo;{rec.text}&rdquo;
        </p>
      </div>
      <div className="pt-6 mt-auto" style={{ borderTop: "1px solid hsl(300 61% 37% / 0.2)" }}>
        <p className="font-bold text-lg tracking-tight" style={{ color: "#F1E9E9" }}>{rec.name}</p>
        <p className="text-sm font-medium mt-1 truncate" style={{ color: "#E491C9" }}>{rec.designation}</p>
      </div>
    </div>
  );
}

export function RecommendationsSection() {
  const recommendations = extractedData.profile.recommendations;

  return (
    <section className="snap-section section-dark py-24 overflow-hidden" id="recommendations">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Recommendations</h2>
          <p className="text-lg max-w-2xl font-medium" style={{ color: "hsl(318 60% 73% / 0.7)" }}>
            What leaders and peers say about working together.
          </p>
        </motion.div>
      </div>

      {/* Marquee: pauses on hover, cards expand to show full text */}
      <div className="relative flex overflow-x-hidden group/marquee">
        {/* First copy */}
        <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] flex gap-8 shrink-0 px-4 items-start">
          {recommendations.map((rec, index) => (
            <RecCard key={`a-${index}`} rec={rec} />
          ))}
        </div>

        {/* Second copy for seamless loop */}
        <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] flex gap-8 shrink-0 px-4 items-start" aria-hidden="true">
          {recommendations.map((rec, index) => (
            <RecCard key={`b-${index}`} rec={rec} />
          ))}
        </div>

        {/* Gradient Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10" style={{ background: "linear-gradient(to right, hsl(238 47% 16%), transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10" style={{ background: "linear-gradient(to left, hsl(238 47% 16%), transparent)" }} />
      </div>
    </section>
  );
}
