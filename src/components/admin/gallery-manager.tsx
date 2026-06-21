"use client";

import { Trash2, Plus } from "lucide-react";
import { addWorkImage, deleteWorkImage } from "@/app/actions/works";
import { ImageField } from "@/components/admin/image-field";
import { Card } from "@/components/admin/ui";

type GalleryImage = { id: string; url: string; alt: string | null };

export function GalleryManager({
  workId,
  images,
}: {
  workId: string;
  images: GalleryImage[];
}) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="font-semibold">Galeri</h2>
        <p className="mt-1 text-sm text-muted">
          Çalışma detay sayfasında gösterilecek ek görseller.
        </p>
      </div>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <li key={img.id} className="group relative">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
              <form action={deleteWorkImage} className="absolute right-2 top-2">
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="workId" value={workId} />
                <button
                  type="submit"
                  aria-label="Görseli sil"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-danger shadow-soft backdrop-blur transition-colors hover:bg-danger hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addWorkImage} className="space-y-3 border-t border-border pt-5">
        <input type="hidden" name="workId" value={workId} />
        <ImageField name="url" label="Yeni Görsel" />
        <input
          name="alt"
          placeholder="Görsel açıklaması (opsiyonel)"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Galeriye Ekle
        </button>
      </form>
    </Card>
  );
}
