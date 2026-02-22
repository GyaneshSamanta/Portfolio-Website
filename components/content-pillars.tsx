"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Layers, Mic, Github, ArrowRight } from "lucide-react";

import extractedData from "@/data/extracted_content.json";
import videos from "@/data/videos.json";

const pillars = [
  {
    title: "Product Thinking",
    description: "Deep dives into product strategy, psychology, and growth via my Newsletter.",
    icon: Layers,
    href: "/newsletter",
    color: "text-blue-500",
    previewData: extractedData.newsletter.slice(0, 3).map(n => ({ title: n.title, date: n.date })),
  },
  {
    title: "The Creator Journey",
    description: "Insights on building in public, creator economy, and tech trends on the Podcast.",
    icon: Mic,
    href: "/podcast",
    color: "text-pink-500",
    previewData: videos.slice(0, 3).map(v => ({ title: v.title, date: "Watch Now" })),
  },
  {
    title: "Engineering",
    description: "Open source contributions, side projects, and experiments on GitHub.",
    icon: Github,
    href: "/github",
    color: "text-purple-500",
    previewData: [
      { title: "Portfolio Website", date: "TypeScript" },
      { title: "SaaS Starter Kit", date: "Next.js" },
      { title: "AI Agent Framework", date: "Python" }
    ], // Mock data for GitHub as we don't fetch it here yet
  },
];

export function ContentPillars() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <Section className="bg-secondary/5 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <Link 
            key={pillar.title} 
            href={pillar.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative h-full"
          >
            <Card className="h-full transition-all duration-300 border-white/10 group-hover:border-primary/50 overflow-hidden relative z-10">
              <CardHeader className="relative z-20">
                <div className={`mb-6 p-4 rounded-2xl bg-secondary/50 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  <pillar.icon className={`h-8 w-8 ${pillar.color}`} />
                </div>
                <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{pillar.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {pillar.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-20 pb-8">
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-primary/10 w-fit px-4 py-2 rounded-full">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>

              {/* Hover Preview Overlay */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-background/95 backdrop-blur-sm z-30 p-6 flex flex-col justify-center border border-primary/20 rounded-xl"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Latest Updates</p>
                    <div className="space-y-4">
                      {pillar.previewData.map((item, i) => (
                        <div key={i} className="flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                          <span className="font-medium text-foreground line-clamp-1 group/item hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            
            {/* Decorative backing glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color.replace('text-', 'from-')}/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 z-0 h-full w-full rounded-xl`} />
          </Link>
        ))}
      </div>
    </Section>
  );
}
