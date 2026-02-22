"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center pb-24 px-4 md:px-12 max-w-7xl mx-auto pt-24 md:pt-32">
      <div className="flex flex-col gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm w-fit text-foreground/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Available for hire</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tighter max-w-5xl text-foreground"
        >
          Building at the intersection of AI, deep tech, and product strategy.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-foreground/80 leading-relaxed space-y-6 max-w-3xl"
        >
          <p>I think in systems. I build in products. I write about both.</p>
          <p>I make sense of complex products. Whether it&apos;s building B2B experiences that actually scale, or helping teams navigate AI integration without losing sight of the user — that&apos;s where I add value.</p>
          <p><strong className="text-foreground">Right now:</strong> Building B2B product experiences at IBM. Researching how AI reshapes the PM role.</p>
          <p><strong className="text-foreground">Previously:</strong> Built and scaled products in competitive spaces (e-commerce, Web3, ed-tech). Been in the rooms where teams panic about pivots, data quality crises, and AI roadmap chaos.</p>
          <p><strong className="text-foreground">What I write about:</strong> Product strategy that sticks. AI in realistic terms (not hype). How behavioral science actually changes user decisions. Case studies from the frontlines.</p>
        </motion.div>
      </div>
    </section>
  );
}
