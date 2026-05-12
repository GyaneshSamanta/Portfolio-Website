import Image from "next/image";
import { Newspaper } from "lucide-react";
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
      showArrow
      className="!p-0"
    >
      {coverImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized={/^https?:\/\//.test(coverImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent" />
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-brand-magenta/20 via-brand-violet/15 to-bg-card" />
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-tertiary">
          <Newspaper className="h-3.5 w-3.5" />
          Latest essay
        </div>
        <h3 className="mt-3 text-base font-semibold leading-snug text-fg-primary md:text-lg">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-4 font-mono text-xs text-fg-tertiary">
          <span>{date}</span>
          {readTime && <span>{readTime}</span>}
        </div>
      </div>
    </BentoTile>
  );
}
