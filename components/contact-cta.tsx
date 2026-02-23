"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export function ContactCTA() {
  return (
    <section className="snap-section section-dark" id="contact">
      <div className="py-32 px-4 md:px-12 max-w-5xl mx-auto text-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 md:p-16 rounded-[2.5rem] bg-foreground text-background shadow-2xl shadow-foreground/10 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Let's build together.
          </h2>
          <p className="text-background/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Whether you're scaling a B2B platform, integrating GenAI, or need a strategic product sense, I'm open for conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button 
              data-cal-link="gyanesh-samanta/15min"
              data-cal-namespace="15min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground hover:bg-white/90 font-semibold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center text-lg"
            >
              Book a Call
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="mailto:mail.gyaneshsamanta@gmail.com" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-background/20 hover:bg-background/10 text-background font-semibold rounded-full transition-colors duration-300 w-full sm:w-auto justify-center text-lg"
            >
              <Mail className="w-5 h-5" />
              Email Me
            </a>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
