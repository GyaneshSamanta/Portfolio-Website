/**
 * Footer — v2.1
 * Three blocks: name + tagline, quick links, social icons. Stacks on mobile.
 */

import Link from "next/link";
import { Github, Linkedin, Mail, Youtube, type LucideIcon } from "lucide-react";
import footerData from "@/data/footer.json";

const ICON_MAP: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  mail: Mail,
};

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle bg-bg-base">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 md:grid-cols-3 md:px-8 lg:px-12">
        {/* Left — identity */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            data-cursor="Home"
            className="text-lg font-semibold text-fg-primary"
          >
            {footerData.footerName}
            <span className="text-brand-magenta">.</span>
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            {footerData.footerTagline}
          </p>
          <p className="mt-4 font-mono text-[11px] text-fg-tertiary">
            {footerData.copyrightText}
          </p>
        </div>

        {/* Middle — quick links */}
        <nav aria-label="Footer navigation">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            Sections
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {footerData.links.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  data-cursor={link.label}
                  className="text-sm text-fg-secondary transition-colors hover:text-fg-primary"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right — socials icon row */}
        <div className="md:text-right">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            Elsewhere
          </div>
          <ul className="mt-4 flex flex-wrap items-center gap-3 md:justify-end">
            {footerData.socials?.map((s) => {
              const Icon = ICON_MAP[s.icon] ?? Mail;
              return (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target={s.url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    data-cursor={s.label}
                    title={s.handle}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-bg-card/40 text-fg-secondary transition-colors hover:border-border-strong hover:text-fg-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-fg-tertiary md:text-right">
            Built in public.
          </p>
        </div>
      </div>
    </footer>
  );
}
