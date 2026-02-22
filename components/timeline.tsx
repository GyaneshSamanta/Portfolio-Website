"use client";

import { motion } from "framer-motion";
import extractedData from "@/data/extracted_content.json";
import newContent from "@/data/new_content.json";
import { Card } from "@/components/ui/card";

export function Timeline() {
  const allExperience = extractedData.profile.experience;

  // Split logic based on data inference
  const fullTimeRoles = allExperience.filter(
    exp => !exp.title?.includes("Intern") && !exp.company.includes("Association") && !exp.title?.includes("Fellowship")
  );
  
  const internships = allExperience.filter(
    exp => exp.title?.includes("Intern") || exp.title?.includes("Fellowship")
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

  const ColumnCard = ({ title, company, dates, details, roles }: { title?: string, company: string, dates?: string, details?: string, roles?: any[] }) => (
    <motion.div variants={item} className="mb-8 group">
      <Card className="p-6 md:p-8 bg-transparent border-t border-b-0 border-x-0 border-border group-hover:border-primary/30 transition-colors">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-foreground">{company}</h3>
          
          {roles ? (
            <div className="flex flex-col gap-4 mt-2">
              {roles.map((role, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-px bg-border group-hover:bg-primary/20 shrink-0 ml-2 mt-2" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground/80">{role.title}</span>
                    <span className="text-sm font-mono text-muted-foreground">{role.dates}</span>
                    {role.details && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{role.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <span className="font-medium text-foreground/80">{title}</span>
              <span className="text-sm font-mono text-muted-foreground">{dates}</span>
              {details && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{details}</p>}
            </>
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
          {newContent.education.map((edu, idx) => (
            <motion.div key={idx} variants={item} className="mb-8 group">
              <Card className="p-6 md:p-8 bg-transparent border-t border-b-0 border-x-0 border-border group-hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground">{edu.university}</h3>
                  <span className="font-medium text-foreground/80">{edu.degree}</span>
                  <span className="text-sm font-mono text-muted-foreground">{edu.dates}</span>
                  {(edu.details || edu.grade) && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {edu.details} {edu.grade && `| Grade: ${edu.grade}`}
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
          {fullTimeRoles.map((exp, idx) => (
            <ColumnCard 
              key={idx}
              title={exp.title}
              company={exp.company}
              dates={exp.dates}
              details={exp.details}
              roles={exp.roles}
            />
          ))}
        </div>
      </div>

      {/* Internships Column */}
      <div className="flex flex-col">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-12 sticky top-24">Internships & Research</h2>
        <div className="flex flex-col">
          {internships.map((exp, idx) => (
            <ColumnCard 
              key={idx}
              title={exp.title}
              company={exp.company}
              dates={exp.dates}
              details={exp.details}
            />
          ))}
        </div>
      </div>

    </motion.div>
  );
}
