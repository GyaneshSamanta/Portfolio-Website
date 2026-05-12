/**
 * Writing — DESIGN.md §5.5
 * Magazine-styled featured post + 2-col grid of next 4 compact cards.
 * All posts open the in-site /blog/<slug> reader. Sourced from data/blog.json.
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Newspaper } from "lucide-react";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";

export function WritingSection() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const grid = rest.slice(0, 4);

  return (
    <section
      id="writing"
      className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Newspaper className="h-3.5 w-3.5" />
            Writing · {posts.length} editions
          </div>
          <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            <span className="font-serif italic">Gyanesh on Product</span>
          </h2>
          <p className="mt-3 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Weekly essays on product, AI, behavioural economics, and consumer behaviour.
            Mirrored in-site from LinkedIn — no jump-out.
          </p>
        </header>

        <FeaturedCard post={featured} />

        {grid.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {grid.map((p) => (
              <CompactCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            data-cursor="View archive"
            className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-card/50 px-5 py-2.5 text-sm font-semibold text-fg-primary transition-colors duration-200 ease-swift hover:border-border-glow hover:bg-bg-card-hover"
          >
            Read all {posts.length} editions
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Subscribe"
            className="text-sm font-medium text-fg-secondary underline-offset-4 transition-colors hover:text-fg-primary hover:underline"
          >
            Subscribe on LinkedIn →
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FeaturedCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="Read"
      className="group relative grid overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px]">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-swift group-hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/30 via-brand-violet/20 to-bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-bg-card via-transparent to-transparent" />
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
          <span>Latest edition</span>
          {post.dateDisplay && (
            <>
              <span aria-hidden>·</span>
              <span>{post.dateDisplay}</span>
            </>
          )}
        </div>

        <h3 className="mt-4 font-serif text-[clamp(1.5rem,3vw,2.5rem)] italic leading-[1.1] text-fg-primary">
          {post.title}
        </h3>

        <p className="mt-4 line-clamp-3 text-base text-fg-secondary md:text-lg">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="inline-flex items-center gap-1 font-mono text-xs text-fg-tertiary">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
          <ArrowUpRight className="h-5 w-5 text-fg-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

function CompactCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="Read"
      className="group flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 sm:flex-row"
    >
      <div className="relative aspect-[16/10] flex-shrink-0 sm:aspect-auto sm:w-48">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/25 via-brand-purple/10 to-bg-card" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          {post.dateDisplay}
        </div>
        <h4 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-fg-primary">
          {post.title}
        </h4>
        <p className="mt-2 line-clamp-2 text-sm text-fg-secondary">{post.excerpt}</p>
        <div className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
          <Clock className="h-3 w-3" />
          {post.readTime}
        </div>
      </div>
    </Link>
  );
}
