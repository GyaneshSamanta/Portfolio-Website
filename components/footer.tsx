import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Link href="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
            Gyanesh Samanta<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Building products, communities, and narratives.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={SITE_CONFIG.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={SITE_CONFIG.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${SITE_CONFIG.links.email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Email
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gyanesh Samanta.
        </p>
      </div>
    </footer>
  );
}
