"use client";

import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";
import educationData from "@/data/education.json";
import { Card } from "@/components/ui/card";

export function Timeline() {
  // Split based on type field from wiki data
  const fullTimeRoles = experienceData.filter(
    (exp: any) =>
      exp.type === "full_time" ||
      exp.type === "extracurricular"
  );

  const internships = experienceData.filter(
    (exp: any) =>
      exp.type === "internship"
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "linear" as const } }
  };

  const ColumnCard = ({ title, company, dates, description, tags }: { title?: string, company: string, dates?: string, description?: string, tags?: string[] }) => (
    <motion.div variants={item} className="mb-8 group">
      <Card className="p-6 md:p-8 border border-border rounded-xl bg-brand-gradient-card group-hover:border-primary/40 transition-all duration-300">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xl shrink-0 group-hover:bg-brand/10 group-hover:border-brand/40 group-hover:text-brand transition-all duration-300">
               {company.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-foreground">{company}</h3>
          </div>
          <span className="font-medium text-foreground/80">{title}</span>
          <span className="text-sm font-mono text-muted-foreground">{dates}</span>
          {description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{description}</p>}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full mt-12"
    >
      {/* Education Column */}
      <div className="flex flex-col">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-12 sticky top-24">Education</h2>
        <div className="flex flex-col">
          {educationData.map((edu: any, idx: number) => (
            <motion.div key={idx} variants={item} className="mb-8 group">
              <Card className="p-6 md:p-8 border border-border rounded-xl bg-brand-gradient-card group-hover:border-primary/40 transition-all duration-300">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xl shrink-0 group-hover:bg-brand/10 group-hover:border-brand/40 group-hover:text-brand transition-all duration-300">
                       {edu.university.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{edu.university}</h3>
                  </div>
                  <span className="font-medium text-foreground/80">{edu.degree}</span>
                  <span className="text-sm font-mono text-muted-foreground">{edu.dates}</span>
                  {(edu.description || edu.grade) && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {edu.description} {edu.grade && `| Grade: ${edu.grade}`}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Time Roles Column */}
      <div className="flex flex-col">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-12 sticky top-24">Full-Time</h2>
        <div className="flex flex-col">
          {fullTimeRoles.map((exp: any, idx: number) => (
            <ColumnCard 
              key={idx}
              title={exp.title}
              company={exp.company}
              dates={exp.dates}
              description={exp.description}
              tags={exp.tags}
            />
          ))}
        </div>
      </div>

      {/* Internships Column */}
      <div className="flex flex-col">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-12 sticky top-24">Internships & Research</h2>
        <div className="flex flex-col">
          {internships.map((exp: any, idx: number) => (
            <ColumnCard 
              key={idx}
              title={exp.title}
              company={exp.company}
              dates={exp.dates}
              description={exp.description}
              tags={exp.tags}
            />
          ))}
        </div>
      </div>

    </motion.div>
  );
}
