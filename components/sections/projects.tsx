"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import projectsData from "@/data/projects.json";

export function ProjectsSection() {
  const featured = (projectsData as any[]).find((p: any) => p.featured);
  const others = (projectsData as any[]).filter((p: any) => !p.featured);

  // Collect all unique tags from non-featured projects for filter
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    others.forEach((p: any) => {
      (p.tags || []).forEach((t: string) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [others]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!activeTag) return others;
    return others.filter((p: any) => (p.tags || []).includes(activeTag));
  }, [activeTag, others]);

  return (
    <section className="snap-section section-light" id="projects">
      <div className="py-24 px-4 md:px-12 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex items-end justify-between"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            B2B capabilities powered by B2C UX principles. Showcasing open source impact.
          </p>
        </div>
      </motion.div>

      {/* Tag Filter Bar — UX Enhancement 11.7 */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeTag === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Featured Project */}
        {featured && (
          <motion.a
            href={featured.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group block relative p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col justify-between hover:bg-secondary/50 transition-colors duration-500 overflow-hidden md:col-span-2 lg:col-span-2 shadow-sm"
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                  <div className="text-sm font-medium px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                    Featured Plugin
                  </div>
                  {featured.downloads > 0 && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-500 pt-2 pb-2">
                      <Download className="w-4 h-4" />
                      {featured.downloads} Installs
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-foreground">{featured.title}</h3>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                {featured.description}
              </p>
              
              <div className="mt-auto grid grid-cols-1 gap-6 pt-6 border-t border-border/50 lg:grid-cols-3">
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Stack</h4>
                   <p className="text-sm font-medium text-foreground">{featured.techStack}</p>
                 </div>
                 {featured.strategicInsight && (
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Insight</h4>
                     <p className="text-sm font-medium text-foreground">{featured.strategicInsight}</p>
                   </div>
                 )}
                 {featured.impact && (
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Impact</h4>
                     <p className="text-sm font-medium text-foreground">{featured.impact}</p>
                   </div>
                 )}
              </div>
            </div>
          </motion.a>
        )}

        {/* Other Projects — with filter animation */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: any, index: number) => (
            <motion.a
              key={project.title}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              layout
              className="group block relative p-8 rounded-3xl bg-card border border-border flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-500"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-xs font-mono font-medium tracking-wide px-3 py-1 rounded bg-secondary text-secondary-foreground">
                    {project.techStack?.split(' | ')[0] || "Docs"}
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description || "Open source contribution."}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                    {project.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
