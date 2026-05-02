import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompactCard } from "@/components/sections/writing";
import writingData from "@/data/writing.json";

export const metadata: Metadata = {
  title: "Writing — All editions",
  description:
    "All issues of Gyanesh on Product — essays on product, AI, and consumer behaviour.",
};

export default function WritingArchivePage() {
  return (
    <section className="px-5 py-24 md:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#writing"
          data-cursor="Back home"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary transition-colors hover:text-fg-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <h1 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
          Every edition.
        </h1>
        <p className="mt-3 text-base text-fg-secondary md:text-lg">
          Newsletter archive. Each issue opens on LinkedIn for now.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          {writingData.map((post) => (
            <CompactCard key={post.url} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
