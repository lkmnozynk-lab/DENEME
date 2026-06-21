"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { CoverImage } from "@/components/ui/cover-image";
import { BookCover } from "@/components/ui/book-cover";

type Img = { url: string; alt?: string | null };

/** Full-screen lightbox with zoom-in animation, prev/next and keyboard nav. */
function Overlay({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: Img[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex],
  );
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, prev, onClose]);

  const img = images[index];
  const multiple = images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {multiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Önceki"
            className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Sonraki"
            className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <motion.div
        key={index}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-[82vh] w-full max-w-4xl"
      >
        <Image
          src={img.url}
          alt={img.alt ?? ""}
          fill
          sizes="90vw"
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {multiple && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {images.length}
        </span>
      )}
    </motion.div>
  );
}

/** Clickable cover that opens a zoom lightbox (falls back to gradient cover). */
export function CoverZoom({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return <BookCover src={null} title={title} index={0} ratio="aspect-[3/4]" />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden"
        aria-label="Kapağı büyüt"
      >
        <CoverImage src={src} alt={title} sizes="(max-width:768px) 100vw, 40vw" priority />
        <span className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <Overlay
            images={[{ url: src, alt: title }]}
            index={0}
            onIndex={() => {}}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Gallery grid where each image enlarges in the lightbox on click. */
export function GalleryLightbox({ images }: { images: Img[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl border border-border shadow-soft"
            aria-label="Görseli büyüt"
          >
            <CoverImage src={img.url} alt={img.alt ?? ""} />
            <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
              <ZoomIn className="h-7 w-7 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {index !== null && (
          <Overlay
            images={images}
            index={index}
            onIndex={setIndex}
            onClose={() => setIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
