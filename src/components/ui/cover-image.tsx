"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Book-cover image with a premium reveal:
 *  - shimmer skeleton while loading
 *  - blur-up + fade-in when loaded
 *  - subtle zoom on hover (inside a `group`)
 *  - glossy light sweep on hover (book sheen)
 */
export function CoverImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  enableShine = true,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  enableShine?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span className="cover-skeleton absolute inset-0" aria-hidden />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-[transform,opacity,filter] duration-700 ease-out group-hover:scale-[1.06]",
          loaded
            ? "scale-100 opacity-100 blur-0"
            : "scale-105 opacity-0 blur-md",
        )}
      />
      {enableShine && <span className="cover-shine" aria-hidden />}
    </>
  );
}
