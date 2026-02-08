import newsletters from "@/data/newsletter.json";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/section";

// I'll inline a badge style for now since I forgot to create Badge component.
// Or creating Badge component now would be better.
// I'll assume Badge component exists in imports -> Wait, I didn't create it. I should use simple span.

export const metadata = {
  title: "Newsletter",
  description: "Thoughts on product management and tech.",
};

export default function NewsletterPage() {
  return (
    <Section>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Newsletter</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Weekly deep dives into product strategy, systems thinking, and delivering value.
          </p>
          <div className="mt-6">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="https://linkedin.com/newsletters/YOUR_NEWSLETTER_ID" target="_blank">
                Subscribe on LinkedIn
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {newsletters.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{item.title}</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                  <div className="flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-secondary/10 text-primary text-xs font-medium border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                   <Button variant="outline" asChild>
                    <Link href={item.url} target="_blank">
                      Read Article <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
