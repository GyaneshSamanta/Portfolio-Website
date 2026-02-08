"use client";

import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Layers, Mic, Github } from "lucide-react";

const pillars = [
  {
    title: "Product Thinking",
    description: "Deep dives into product strategy, psychology, and growth via my Newsletter.",
    icon: Layers,
    href: "/newsletter",
    color: "text-blue-500",
  },
  {
    title: "The Creator Journey",
    description: "Insights on building in public, creator economy, and tech trends on the Podcast.",
    icon: Mic,
    href: "/podcast",
    color: "text-pink-500",
  },
  {
    title: "Engineering",
    description: "Open source contributions, side projects, and experiments on GitHub.",
    icon: Github,
    href: "/github",
    color: "text-purple-500",
  },
];

export function ContentPillars() {
  return (
    <Section className="bg-secondary/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <Link key={pillar.title} href={pillar.href}>
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className={`mb-4 p-3 rounded-lg bg-background w-fit border border-white/5`}>
                  <pillar.icon className={`h-6 w-6 ${pillar.color}`} />
                </div>
                <CardTitle>{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {pillar.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
