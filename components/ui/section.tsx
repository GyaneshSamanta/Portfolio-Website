import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
}

export function Section({
  className,
  children,
  container = true,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      {...props}
    >
      {container ? (
        <div className="container px-4 mx-auto relative z-10">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
