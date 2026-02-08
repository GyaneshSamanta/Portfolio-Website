import { Section } from "@/components/ui/section";
import { CalendlyWidget } from "@/components/calendly-widget";
import { EmailCopy } from "@/components/email-copy";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Column: Context & Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Let&apos;s Chat</h1>
            <p className="text-xl text-muted-foreground">
              I&apos;m always open to discussing new opportunities, podcast features, 
              or just geeking out over product management.
            </p>
          </div>

          <div className="space-y-4">
            <EmailCopy />
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Other ways to connect</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <Link href={SITE_CONFIG.links.twitter} target="_blank">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={SITE_CONFIG.links.linkedin} target="_blank">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={SITE_CONFIG.links.github} target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calendly */}
        <div>
          <CalendlyWidget />
        </div>
      </div>
    </Section>
  );
}
