import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Clock, Newspaper } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Gyanesh on Product",
  description:
    "Every issue of Gyanesh on Product — essays on product, AI, behavioural economics, and consumer behaviour.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="relative bg-bg-base px-5 py-24 md:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/#writing"
          data-cursor="Back home"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary transition-colors hover:text-fg-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Newspaper className="h-3.5 w-3.5" />
            Gyanesh on Product · {posts.length} editions
          </div>
          <h1 className="mt-3 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-fg-primary">
            <span className="font-serif italic">Everything</span> I've written.
          </h1>
          <p className="mt-4 max-w-[60ch] text-base text-fg-secondary md:text-lg">
            Essays on product management, AI, behavioural economics, and consumer behaviour.
            Every issue is mirrored here from LinkedIn. Read inline; no need to leave.
          </p>
        </header>

        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            data-cursor="Read"
            className="group mt-12 grid overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70 lg:grid-cols-[1.2fr_1fr]"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px]">
              {featured.cover ? (
                <Image
                  src={featured.cover}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
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
                <span>Latest</span>
                <span aria-hidden>·</span>
                <span>{featured.dateDisplay}</span>
              </div>

              <h2 className="mt-4 font-serif text-[clamp(1.75rem,3vw,2.75rem)] italic leading-[1.1] text-fg-primary">
                {featured.title}
              </h2>

              <p className="mt-4 line-clamp-4 text-base text-fg-secondary md:text-lg">
                {featured.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between pt-8">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-fg-tertiary">
                  <Clock className="h-3 w-3" />
                  {featured.readTime}
                </span>
                <ArrowUpRight className="h-5 w-5 text-fg-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                data-cursor="Read"
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70"
              >
                <div className="relative aspect-[16/9]">
                  {post.cover ? (
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                  <h3 className="mt-2 line-clamp-3 text-base font-semibold leading-snug text-fg-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-secondary">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-fg-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
