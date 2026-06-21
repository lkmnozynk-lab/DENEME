"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-xl font-semibold">Bir hata oluştu</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        İşlem tamamlanamadı. Veritabanı bağlantınızı kontrol edip tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
