import { cn } from "@/lib/utils";

/**
 * NERAAJANS logomark — a minimalist "N" formed from two open book pages.
 * Uses `currentColor` so it renders correctly in monochrome and any theme.
 * The same mark scales down cleanly to a favicon.
 */
export function LogoMark({
  className,
  title = "NERAAJANS",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={cn("h-9 w-9", className)}
      fill="none"
    >
      {/* Spine */}
      <path
        d="M24 9.5C20.5 7.4 15.8 6.4 11 6.8c-1 .08-1.7.9-1.7 1.9v27.7c0 1.1.95 1.95 2.04 1.86 4.3-.35 8.5.6 11.66 2.74"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M24 9.5c3.5-2.1 8.2-3.1 13-2.7 1 .08 1.7.9 1.7 1.9v27.7c0 1.1-.95 1.95-2.04 1.86-4.3-.35-8.5.6-11.66 2.74"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-secondary"
      />
      {/* The "N" diagonal, like a turning page */}
      <path
        d="M15.5 31V17.5L32.5 30.5V17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 text-foreground" />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          NERA<span className="text-primary">AJANS</span>
        </span>
      )}
    </span>
  );
}
