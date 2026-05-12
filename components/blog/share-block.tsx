"use client";

import { useState } from "react";
import { Check, Copy, Linkedin, Twitter } from "lucide-react";

export function ShareBlock({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  const encoded = encodeURIComponent(url);
  const xUrl = `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;

  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border-subtle bg-bg-card/50 px-6 py-4">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg-tertiary">
        Share this piece
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          data-cursor={copied ? "Copied!" : "Copy link"}
          aria-label="Copy link"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated/80 text-fg-secondary transition-colors hover:border-border-strong hover:text-fg-primary"
        >
          {copied ? <Check className="h-4 w-4 text-signal-live" /> : <Copy className="h-4 w-4" />}
        </button>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Share on X"
          aria-label="Share on X"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated/80 text-fg-secondary transition-colors hover:border-border-strong hover:text-fg-primary"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={liUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Share on LinkedIn"
          aria-label="Share on LinkedIn"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated/80 text-fg-secondary transition-colors hover:border-border-strong hover:text-fg-primary"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
