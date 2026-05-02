import Link from "next/link";
import footerData from "@/data/footer.json";

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle bg-bg-base">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            data-cursor="Home"
            className="text-base font-semibold text-fg-primary"
          >
            {footerData.footerName}
            <span className="text-brand-magenta">.</span>
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            {footerData.footerTagline}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-secondary">
          {footerData.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor={link.label}
                className="transition-colors hover:text-fg-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-fg-tertiary">{footerData.copyrightText}</p>
      </div>
    </footer>
  );
}
