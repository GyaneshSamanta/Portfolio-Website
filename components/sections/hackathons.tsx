"use client";

import { motion } from "framer-motion";
import hackathonsData from "@/data/hackathons.json";
import { Trophy, Users, ExternalLink } from "lucide-react";

export function HackathonsSection() {
  if (!hackathonsData || hackathonsData.length === 0) return null;

  return (
    <section className="snap-section section-light py-24" id="hackathons">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Hackathon Wall
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {hackathonsData.length}+ national and international hackathon wins and placements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hackathonsData.map((hack: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Win badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                  <Trophy className="w-3 h-3" />
                  {hack.prize}
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <h3 className="text-lg font-bold text-foreground pr-24 group-hover:text-primary transition-colors">
                  {hack.eventName}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {hack.organizer}
                </p>

                <div className="h-px bg-border my-2" />

                <p className="text-sm font-semibold text-foreground">
                  {hack.projectName}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hack.projectDescription}
                </p>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  {hack.teamSize > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Team of {hack.teamSize}
                    </span>
                  )}
                  <span className="font-mono">{hack.date}</span>
                </div>

                {hack.techStack && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {hack.techStack.split(' | ').map((tech: string, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {hack.devpostUrl && (
                  <a
                    href={hack.devpostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Project
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
