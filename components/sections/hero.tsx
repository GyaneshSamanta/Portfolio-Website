"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col pb-24 px-4 md:px-12 max-w-[1400px] mx-auto pt-32 md:pt-40 relative">
      
      {/* Verris Split Typography Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mb-16 md:mb-24 w-full">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-6xl md:text-[8rem] lg:text-[11rem] font-bold tracking-tighter leading-none text-foreground uppercase"
        >
          GYANESH
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="hidden md:block h-3 bg-foreground flex-1 origin-left mt-4"
        />

        <motion.h1 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-6xl md:text-[8rem] lg:text-[11rem] font-bold tracking-tighter leading-none text-foreground uppercase"
        >
          SAMANTA
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 relative z-10 w-full items-start">
        
        {/* Left Typography Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 flex flex-col gap-8 md:pr-12"
        >
          <h2 className="text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight max-w-3xl text-foreground">
            Building at the intersection of AI, deep tech, and product strategy.
          </h2>

          <div className="text-lg md:text-xl text-muted-foreground leading-relaxed space-y-6 max-w-2xl font-medium">
            <p>I think in systems. I build in products. I write about both.</p>
            <p className="text-foreground/90">I make sense of complex products. Whether it's building B2B experiences that actually scale, or helping teams navigate AI integration without losing sight of the user — that's where I add value.</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background shadow-sm w-fit text-foreground/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide">Available for hire</span>
            </div>
            <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest px-4">
              Based in India
            </div>
          </div>
        </motion.div>

        {/* Right Editorial Headshot */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5 w-full aspect-[3/4] md:aspect-[4/5] relative bg-secondary overflow-hidden group border border-border"
        >
          <Image 
            src="/images/headshot.jpg" 
            alt="Gyanesh Samanta" 
            fill 
            className="object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 mix-blend-multiply" />
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
            <div className="font-mono text-xs uppercase tracking-widest mix-blend-difference">
              Product Strategy <br /> System Design
            </div>
            <div className="font-mono text-xs mix-blend-difference">
              {new Date().getFullYear()} ©
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
