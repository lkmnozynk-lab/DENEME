import { cn } from "@/lib/utils";
import { CoverImage } from "@/components/ui/cover-image";

/**
 * Renders a book/article cover. Falls back to a tasteful generated cover
 * (gradient + title) when no image is provided, so cards never look broken.
 */
export function BookCover({
  src,
  title,
  index = 0,
  className,
  ratio = "aspect-[3/4]",
}: {
  src?: string | null;
  title: string;
  index?: number;
  className?: string;
  ratio?: string;
}) {
  const tones = [
    "from-primary to-primary/60",
    "from-secondary to-secondary/60",
    "from-accent to-surface-2",
  ];
  const tone = tones[index % tones.length];
  const onAccent = index % 3 === 2 ? "text-foreground" : "text-white";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden", ratio, className)}>
        <CoverImage src={src} alt={title} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        tone,
        ratio,
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-2.5 bg-black/15" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.22),transparent)]" />
      <div className={cn("relative flex h-full flex-col justify-between p-6", onAccent)}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
          NERAAJANS
        </span>
        <p className="font-display text-xl font-semibold leading-tight">
          {title}
        </p>
      </div>
    </div>
  );
}
