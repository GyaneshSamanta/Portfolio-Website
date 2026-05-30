"use client";

/**
 * Navbar — DESIGN.md §4 / handoff PNGs
 * Two states: floating-glassy on top, compact-pill on scroll. Anchor-based
 * navigation matching the new IA. Mobile collapses behind a sheet.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Journey", href: "/#journey" },
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "Podcast", href: "/#podcast" },
  { label: "Recs", href: "/#recommendations" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const update = () =>
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding,background-color,backdrop-filter] duration-500",
          scrolled ? "px-3 pt-3 md:px-6 md:pt-4" : "px-3 pt-3 md:px-8 md:pt-6"
        )}
      >
        <div
          className={cn(
            "glass specular relative mx-auto flex items-center gap-3 rounded-full transition-all duration-500 ease-spring",
            scrolled
              ? "h-12 max-w-3xl px-3 md:h-14 md:px-4"
              : "h-16 max-w-[1400px] px-4 md:h-20 md:px-6"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            data-cursor="Home"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-full ring-1 ring-border-strong">
              <Image
                src="/images/brand/newsletter-cover.png"
                alt="Gyanesh Samanta"
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg-secondary md:inline">
              Gyanesh Samanta
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-cursor={item.label}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-bg-card hover:text-fg-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Time pill — desktop only, on top state. */}
          {!scrolled && (
            <div className="ml-3 hidden items-center gap-2 rounded-full border border-border-subtle bg-bg-card/60 px-3 py-1 font-mono text-[11px] text-fg-tertiary backdrop-blur md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-live" aria-hidden />
              India · {currentTime}
            </div>
          )}

          {/* CTA */}
          <Link
            href="/#contact"
            data-cursor="Contact"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-4 py-1.5 text-sm font-semibold text-white transition-transform duration-200 ease-swift hover:scale-[1.03] md:ml-2"
          >
            Let's talk
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            data-cursor="Menu"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-card/40 text-fg-primary md:hidden"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-base/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-24">
              <ul className="flex flex-col gap-2">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-2xl border border-border-subtle bg-bg-card/50 px-4 py-4 text-2xl font-semibold text-fg-primary"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                <span>
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal-live align-middle" />
                  India · {currentTime}
                </span>
                <Link
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="text-fg-primary"
                >
                  Contact →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
