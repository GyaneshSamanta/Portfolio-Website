"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function WritingSection() {
  return (
    <section className="snap-section section-light" id="writing">
      <div className="py-24 px-4 md:px-12 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Writing</h2>
          <p className="text-muted-foreground text-lg">
            Editions from the <strong>Gyanesh on Product</strong> newsletter on LinkedIn.
          </p>
        </div>
        
        <a 
          href="https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-transform"
        >
          Subscribe
        </a>
      </motion.div>

      <div className="flex flex-col border-t border-border">
        {extractedData.newsletter.map((article, index) => (
          <motion.a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-border hover:bg-secondary/20 transition-all duration-300 md:px-8 -mx-4 px-4 md:-mx-8 rounded-xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 shrink-0 relative rounded overflow-hidden shadow-sm hidden md:block">
                <Image 
                  src="/images/newsletter-cover.png" 
                  alt="Newsletter Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-medium max-w-2xl group-hover:text-primary transition-colors text-foreground mb-1">
                  {article.title}
                </h3>
                {article.date && (
                  <span className="text-muted-foreground font-mono text-sm">
                    {article.date} &bull; Read on LinkedIn
                  </span>
                )}
              </div>
            </div>
            
            <div className="w-10 h-10 shrink-0 mt-4 md:mt-0 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:border-transparent">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </motion.a>
        ))}
      </div>
      </div>
    </section>
  );
}
