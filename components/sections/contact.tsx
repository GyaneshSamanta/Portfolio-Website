"use client";

/**
 * Contact — DESIGN.md §5.8
 * 4-tile bento: large Cal.com CTA, click-to-copy email, newsletter signup,
 * and socials grid. The big tile is a button that triggers the Cal embed via
 * the existing Cal.ns global (loaded lazily in app/layout.tsx).
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Check, Copy, Github, Linkedin, Mail, Newspaper, Youtube } from "lucide-react";
import contactData from "@/data/contact.json";
import metaData from "@/data/meta.json";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">Contact</div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            <span className="font-serif italic">Let's build</span> something.
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            {contactData.sectionSubheadline}
          </p>
        </header>

        <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          <CalTile />
          <EmailTile email={metaData.email} />
          <NewsletterTile />
          <SocialsTile />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CalTile() {
  return (
    <button
      type="button"
      data-cal-link="gyanesh-samanta/15min"
      data-cal-namespace="15min"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
      data-cursor="Book a call"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border-strong p-8 text-left transition-[transform,border-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-glow lg:col-span-8 lg:row-span-2 md:p-10"
      style={{
        background:
          "radial-gradient(circle at 20% 0%, hsl(var(--brand-magenta) / 0.25), transparent 55%), radial-gradient(circle at 80% 100%, hsl(var(--brand-violet) / 0.25), transparent 55%), hsl(var(--bg-card) / 0.6)",
      }}
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        <Calendar className="h-3.5 w-3.5" />
        Book a 30-min call
      </div>
      <h3 className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.01em] text-fg-primary">
        Pick a slot. <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-pink">I show up.</span>
      </h3>
      <p className="mt-4 max-w-[40ch] text-fg-secondary md:text-lg">
        Senior PM roles, research collaborations, advisory. If we both like the conversation, we keep going.
      </p>
      <div className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-fg-primary">
        Open the scheduler
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function EmailTile({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: open mailto.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor={copied ? "Copied!" : "Click to copy"}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 p-6 text-left backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 lg:col-span-4"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        <Mail className="h-3.5 w-3.5" />
        Email
      </div>
      <div className="mt-4 break-all text-base font-semibold text-fg-primary md:text-lg">
        {email}
      </div>
      <div className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-xs text-fg-secondary">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-signal-live" />
            <span className="text-signal-live">Copied to clipboard</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Click to copy
          </>
        )}
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function NewsletterTile() {
  return (
    <a
      href={contactData.ctaNewsletterUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Subscribe"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 p-6 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 lg:col-span-4"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        <Newspaper className="h-3.5 w-3.5" />
        Newsletter
      </div>
      <div className="mt-4 text-base font-semibold text-fg-primary md:text-lg">
        Get my next essay in your inbox.
      </div>
      <p className="mt-2 text-sm text-fg-secondary">
        Weekly. No fluff. Mostly product, AI, and consumer behaviour.
      </p>
      <div className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-fg-primary">
        Subscribe on LinkedIn
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

/* -------------------------------------------------------------------------- */

function SocialsTile() {
  const socials: { label: string; href: string; Icon: any; handle: string }[] = [
    { label: "LinkedIn", href: metaData.linkedinUrl, Icon: Linkedin, handle: "@gyaneshsamanta" },
    { label: "GitHub", href: metaData.githubUrl, Icon: Github, handle: "@GyaneshSamanta" },
    { label: "YouTube", href: metaData.youtubeUrl, Icon: Youtube, handle: "@gyanesh" },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 p-6 backdrop-blur-sm lg:col-span-4">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">Elsewhere</div>
      <ul className="mt-4 grid gap-2">
        {socials.map(({ label, href, Icon, handle }) => (
          <li key={label}>
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor={label}
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center justify-between rounded-2xl border border-border-subtle bg-bg-elevated/60 px-4 py-3 transition-colors hover:border-border-strong hover:bg-bg-card"
            >
              <span className="inline-flex items-center gap-3">
                <Icon className="h-4 w-4 text-fg-secondary" />
                <span className="text-sm font-medium text-fg-primary">{label}</span>
              </span>
              <span className="font-mono text-xs text-fg-tertiary">{handle}</span>
            </motion.a>
          </li>
        ))}
      </ul>
    </div>
  );
}
