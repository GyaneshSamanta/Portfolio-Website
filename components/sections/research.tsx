"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import data from "@/data/new_content.json";

export function ResearchSection() {
  return (
    <section className="snap-section section-dark flex items-center" id="research">
      <div className="py-24 px-4 md:px-12 max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Research Publications</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Academic research spanning edge computing, IoT architecture, and behavioral models in Web3.
        </p>
        
        <a 
          href="https://scholar.google.com/citations?user=KgKCj14AAAAJ&hl=en" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-transform"
        >
          <BookOpen className="w-5 h-5" />
          Google Scholar Profile
        </a>
      </motion.div>

      <div className="flex flex-col border-t border-border">
        {data.research.map((paper, index) => (
          <motion.a
            key={index}
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group block py-10 border-b border-border hover:bg-secondary/30 transition-colors duration-300 md:px-8 -mx-4 px-4 md:-mx-8 rounded-xl"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors text-foreground">
                  {paper.title}
                </h3>
                <p className="text-muted-foreground font-medium mb-2">
                  {paper.authors}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-mono bg-secondary px-2 py-1 rounded">{paper.year}</span>
                  <span>{paper.journal}</span>
                  {paper.citations > 0 && (
                    <span className="text-foreground/70 flex items-center gap-1">
                      &bull; {paper.citations} Citations
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-12 h-12 shrink-0 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:border-transparent">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
      </div>
    </section>
  );
}
