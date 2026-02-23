"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "journey", label: "Journey" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "recommendations", label: "Recs" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);

      const sections = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { ...s, offset: Infinity };
        return { ...s, offset: Math.abs(el.getBoundingClientRect().top) };
      });

      const closest = sections.reduce((prev, curr) =>
        curr.offset < prev.offset ? curr : prev
      );
      setActiveSection(closest.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group flex items-center gap-3"
              aria-label={`Go to ${section.label}`}
            >
              <span
                className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  activeSection === section.id
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 group-hover:opacity-70 translate-x-2 group-hover:translate-x-0"
                }`}
                style={{
                  color: activeSection === section.id ? "#E491C9" : "#F1E9E9",
                }}
              >
                {section.label}
              </span>
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: activeSection === section.id ? "12px" : "8px",
                  height: activeSection === section.id ? "12px" : "8px",
                  backgroundColor:
                    activeSection === section.id
                      ? "#982598"
                      : "rgba(228,145,201,0.3)",
                  boxShadow:
                    activeSection === section.id
                      ? "0 0 10px rgba(152,37,152,0.6)"
                      : "none",
                }}
              />
            </button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
