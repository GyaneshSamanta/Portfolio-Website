import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Linkedin } from "lucide-react";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { ArticleShell } from "@/components/blog/article-shell";
import { ShareBlock } from "@/components/blog/share-block";
import { SITE_CONFIG } from "@/lib/constants";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    alternates: post.linkedinUrl ? { canonical: `${SITE_CONFIG.url}/blog/${post.slug}` } : undefined,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(params.slug, 3);
  const shareUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

  return (
    <ArticleShell>
      <div className="bg-bg-base">
        {/* HERO */}
        <header className="relative overflow-hidden border-b border-border-subtle">
          {post.cover && (
            <div className="absolute inset-0 -z-[1]">
              <Image
                src={post.cover}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-[0.18]"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-bg-base/85 to-bg-base" />
            </div>
          )}

          <div className="mx-auto max-w-3xl px-5 pt-28 pb-16 md:px-8 lg:pt-40 lg:pb-24">
            <Link
              href="/blog"
              data-cursor="All posts"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary transition-colors hover:text-fg-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All editions
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              <span>Gyanesh on Product</span>
              {post.dateDisplay && (
                <>
                  <span aria-hidden>·</span>
                  <span>{post.dateDisplay}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-[clamp(2.25rem,6vw,4.5rem)] italic leading-[1.05] tracking-[-0.01em] text-fg-primary">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-secondary md:text-xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </header>

        {/* BODY */}
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 lg:py-20">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          {/* Inline newsletter CTA halfway-ish through (rendered at the bottom
              for simplicity — splitting MDX-rendered HTML by paragraph index
              gets brittle. This still serves the engagement purpose). */}
          <aside className="mt-12 rounded-3xl border border-border-strong bg-gradient-to-br from-brand-magenta/10 via-brand-violet/10 to-transparent p-6 md:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
              Subscribe
            </div>
            <p className="mt-3 font-serif text-2xl italic leading-snug text-fg-primary md:text-3xl">
              Get the next edition straight to your inbox.
            </p>
            <a
              href="https://www.linkedin.com/newsletters/gyanesh-on-product-6979386586404651008/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Subscribe"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-magenta to-brand-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 ease-swift hover:scale-[1.03]"
            >
              Subscribe on LinkedIn
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </aside>

          {/* Share */}
          <ShareBlock url={shareUrl} title={post.title} />

          {/* Original LinkedIn link */}
          {post.linkedinUrl && (
            <div className="mt-6 text-center text-sm text-fg-tertiary">
              Originally published on{" "}
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open on LinkedIn"
                className="inline-flex items-center gap-1 text-fg-secondary underline-offset-4 hover:text-fg-primary hover:underline"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            </div>
          )}
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-border-subtle px-5 py-16 md:px-8 lg:py-24">
            <div className="mx-auto max-w-[1400px]">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
                Keep reading
              </div>
              <h2 className="mt-3 text-2xl font-bold text-fg-primary md:text-3xl">
                More from <span className="font-serif italic">Gyanesh on Product</span>
              </h2>

              <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}`}
                      data-cursor="Read"
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-swift hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-card-hover/70"
                    >
                      <div className="relative aspect-[16/9]">
                        {r.cover ? (
                          <Image
                            src={r.cover}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/25 to-brand-magenta/15" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
                          {r.dateDisplay}
                        </div>
                        <h3 className="mt-2 line-clamp-3 text-base font-semibold leading-snug text-fg-primary">
                          {r.title}
                        </h3>
                        <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">
                          <Clock className="h-3 w-3" />
                          {r.readTime}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </ArticleShell>
  );
}
