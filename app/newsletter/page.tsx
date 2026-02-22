import extractedData from "@/data/extracted_content.json";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Rss } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Newsletter | Gyanesh on Product",
  description: "Thoughts on product management, deep tech, and systems thinking.",
};

export default function NewsletterPage() {
  const newsletters = extractedData.newsletter;

  return (
    <Section>
      <div className="space-y-12">
        <div className="border-b border-border pb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-foreground">Gyanesh on Product</h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80 max-w-3xl leading-snug">
            Weekly deep dives into product strategy, systems thinking, and delivering value in the B2B SaaS era. Active on LinkedIn.
          </p>
          <div className="mt-8">
            <Button size="lg" className="rounded-none bg-brand hover:bg-brand-light text-brand-foreground font-semibold px-8" asChild>
              <Link href="https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/" target="_blank">
                Subscribe on LinkedIn <Rss className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-5xl">
          {newsletters.map((item, id) => (
            <Card key={id} className="border-border bg-card/50 hover:bg-card transition-all duration-300 p-8 md:p-12 group">
              <div className="flex flex-col md:flex-row justify-between gap-8 md:items-start">
                <div className="flex-1 space-y-4">
                  {item.date && (
                    <div className="text-sm font-mono tracking-widest uppercase text-brand">
                      {item.date}
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-foreground group-hover:text-brand-light transition-colors tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl">
                    Published originally on the Gyanesh on Product LinkedIn newsletter. Join the thousands of PMs making sense of enterprise software scaling.
                  </p>
                </div>
                
                <div className="flex items-center shrink-0">
                  <Button variant="outline" className="rounded-none border-border group-hover:bg-brand/10 transition-colors" asChild>
                    <Link href={item.url} target="_blank">
                      Read Edition <ExternalLink className="ml-2 h-4 w-4 opacity-50 text-brand" />
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
