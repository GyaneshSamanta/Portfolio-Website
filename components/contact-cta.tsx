"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function ContactCTA() {
  return (
    <Section className="border-t border-white/10 bg-gradient-to-b from-background to-secondary/5">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ready to build something extraordinary?
        </h2>
        <p className="text-muted-foreground text-lg">
          Whether you have a product idea, need product strategy, or just want to chat about the future of tech.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 text-base">
          <Link href="/contact">
            Get in Touch
          </Link>
        </Button>
      </div>
    </Section>
  );
}
