"use client";

/**
 * Contact — DESIGN.md §5.8 (rev v2.1)
 * Editorial centered layout. Single Cal CTA. Inline email click-to-copy.
 * Socials moved to Footer.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import contactData from "@/data/contact.json";
import metaData from "@/data/meta.json";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg-base px-5 py-32 md:px-8 lg:px-12 lg:py-44"
    >
      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(ellipse_at_center,hsl(var(--brand-magenta)/0.18),transparent_60%),radial-gradient(ellipse_at_30%_80%,hsl(var(--brand-violet)/0.15),transparent_50%)]"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-fg-tertiary">
          Contact
        </div>

        <h2 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
          <span className="font-serif italic">Let&apos;s build</span> something.
        </h2>

        <p className="mt-6 max-w-[52ch] text-base text-fg-secondary md:text-lg">
          {contactData.sectionSubheadline}
        </p>

        <CalCTA />

        <EmailInline email={metaData.email} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CalCTA() {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      data-cal-link="gyanesh-samanta/15min"
      data-cal-namespace="15min"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
      data-cursor="Book a call"
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-7 py-4 text-base font-semibold text-white shadow-[0_18px_48px_-12px_hsl(var(--brand-magenta)/0.7)]"
    >
      Book a 30-min call
      <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */

function EmailInline({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-fg-secondary md:text-base">
      <span>Or email</span>
      <button
        type="button"
        onClick={handleCopy}
        data-cursor={copied ? "Copied!" : "Click to copy"}
        className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-card/60 px-3 py-1 font-mono text-sm text-fg-primary transition-colors hover:border-border-strong"
      >
        {email}
        {copied ? (
          <Check className="h-3.5 w-3.5 text-signal-live" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-fg-tertiary transition-colors group-hover:text-fg-primary" />
        )}
      </button>
    </div>
  );
}
