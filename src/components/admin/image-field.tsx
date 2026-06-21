"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/app/actions/upload";

/**
 * Image upload field. Uploads on selection, stores the resulting URL in a
 * hidden input (so it submits with the parent form), and shows a preview.
 */
export function ImageField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(fd);
      if (res.ok) setUrl(res.url);
      else setError(res.error);
    });
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative inline-block">
          <div className="h-40 w-40 overflow-hidden rounded-xl border border-border">
            {/* Admin preview — plain img avoids the image optimizer for large uploads */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-danger shadow-soft"
            aria-label="Görseli kaldır"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-sm text-muted transition-colors hover:border-primary/50">
          {pending ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6 text-primary" />
              <span>Görsel yükle</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onSelect}
            disabled={pending}
          />
        </label>
      )}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
}
