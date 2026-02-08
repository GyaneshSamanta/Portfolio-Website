"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

export function Timeline() {
  return (
    <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12">
      {SITE_CONFIG.experience.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 md:pl-12"
        >
          {/* Dot */}
          <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-baseline mb-2">
            <h3 className="text-xl font-bold">{item.role}</h3>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-primary font-medium">{item.company}</span>
          </div>
          <span className="text-sm text-muted-foreground mb-4 block">{item.date}</span>
          
          <Card className="bg-card/30 border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
