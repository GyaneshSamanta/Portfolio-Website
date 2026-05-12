"use client";

import { useRef } from "react";
import { ReadingProgress } from "./reading-progress";

export function ArticleShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <>
      <ReadingProgress targetRef={ref} />
      <article ref={ref}>{children}</article>
    </>
  );
}
