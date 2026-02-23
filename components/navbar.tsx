"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Detect scroll for state change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live clock
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#15173D]/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "w-full px-4 md:px-8 flex items-center justify-between transition-all duration-500",
          scrolled ? "h-14" : "h-20"
        )}
      >
        {/* Left: Logo + Contact Info */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <Image
              src="/images/newsletter-cover.png"
              alt="Logo"
              width={scrolled ? 36 : 48}
              height={scrolled ? 36 : 48}
              className="rounded-lg object-cover transition-all duration-500"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-sm font-mono" style={{ color: "hsl(318 60% 73% / 0.7)" }}>
            <span>(91) 8763048771</span>
            <span>mail.gyaneshsamanta@gmail.com</span>
          </div>
        </div>

        {/* Center-Right: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* On home (not scrolled): show expanded nav across rows */}
          {!scrolled ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-8">
                {SITE_CONFIG.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors relative py-1",
                      pathname === item.href
                        ? "text-[#E491C9]"
                        : "text-[#F1E9E9]/60 hover:text-[#E491C9]"
                    )}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2px]"
                        style={{ background: "linear-gradient(90deg, #982598, #E491C9)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-8">
                <Link href={SITE_CONFIG.links.linkedin} target="_blank" className="text-sm font-medium text-[#F1E9E9]/40 hover:text-[#E491C9] transition-colors">
                  LinkedIn
                </Link>
                <Link href="https://scholar.google.com/citations?user=KgKCj14AAAAJ" target="_blank" className="text-sm font-medium text-[#F1E9E9]/40 hover:text-[#E491C9] transition-colors">
                  Scholar
                </Link>
              </div>
            </div>
          ) : (
            /* On scroll: compact single row */
            <div className="flex items-center gap-7">
              {SITE_CONFIG.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    pathname === item.href
                      ? "text-[#E491C9]"
                      : "text-[#F1E9E9]/60 hover:text-[#E491C9]"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px]"
                      style={{ background: "linear-gradient(90deg, #982598, #E491C9)" }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Far Right: Location, Time, Audio */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-sm font-mono" style={{ color: "hsl(0 18% 93% / 0.6)" }}>
            <span>India</span>
            <span style={{ color: "#E491C9" }}>●</span>
            <span>{currentTime}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 transition-colors md:hidden"
            style={{ color: "#F1E9E9" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-40 backdrop-blur-md md:hidden flex flex-col p-8 gap-6 border-t"
            style={{
              backgroundColor: "hsl(238 47% 16% / 0.95)",
              borderColor: "hsl(300 61% 37% / 0.2)",
            }}
          >
            <div className="flex flex-col gap-6">
              {SITE_CONFIG.navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-2xl font-semibold transition-colors block",
                      pathname === item.href ? "text-[#E491C9]" : "text-[#F1E9E9]/70 hover:text-[#E491C9]"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t text-sm font-mono space-y-2" style={{ borderColor: "hsl(300 61% 37% / 0.2)", color: "#E491C9" }}>
              <p>(91) 8763048771</p>
              <p>mail.gyaneshsamanta@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
