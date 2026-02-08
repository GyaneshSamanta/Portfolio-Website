"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { FileText, Mic } from "lucide-react";

export function Hero() {
  return (
    <Section className="min-h-[80vh] flex flex-col justify-center pt-32 pb-16">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Building products, <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              crafting narratives
            </span>
            , and exploring the future.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
        >
          I&apos;m Gyanesh Samanta. A Product Manager obsessed with user psychology, 
          system design, and the intersection of technology and humanity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/newsletter">
              <FileText className="mr-2 h-4 w-4" />
              Read Newsletter
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/podcast">
              <Mic className="mr-2 h-4 w-4" />
              Listen to Podcast
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Decorative Gradient Blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </Section>
  );
}
