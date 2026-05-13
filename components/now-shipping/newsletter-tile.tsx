import Image from "next/image";
import { ArrowUpRight, Newspaper, Clock } from "lucide-react";
import { BentoTile } from "@/components/ui/bento-tile";

type Props = {
  title: string;
  date: string;
  url: string;
  coverImage?: string;
  readTime?: string;
  spanClass?: string;
  rowSpan?: string;
};

export function NewsletterTile({
  title,
  date,
  url,
  coverImage,
  readTime,
  spanClass,
  rowSpan,
}: Props) {
  return (
    <BentoTile
      href={url}
      external={/^https?:\/\//.test(url)}
      spanClass={spanClass}
      rowSpan={rowSpan}
      cursorLabel="Read"
      className="!p-0"
    >
      {/* Horizontal split: thumbnail left, content right (stack on mobile). */}
      <div className="flex h-full flex-col md:flex-row">
        <div className="relative aspect-[16/9] flex-shrink-0 md:aspect-auto md:w-[40%] md:max-w-[420px]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
              unoptimized={/^https?:\/\//.test(coverImage)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/25 via-brand-violet/20 to-bg-card" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-card md:via-bg-card/40" />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-7">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
            <Newspaper className="h-3.5 w-3.5" />
            Latest from the newsletter
          </div>
          <h3 className="mt-3 max-w-[60ch] text-lg font-semibold leading-snug text-fg-primary md:text-2xl">
            {title}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-5 font-mono text-xs text-fg-tertiary">
            <span className="inline-flex items-center gap-3">
              <span>{date}</span>
              {readTime && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readTime}
                  </span>
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-fg-secondary group-hover:text-fg-primary">
              Read it
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
