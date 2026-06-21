"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-2xl font-semibold">Bir şeyler ters gitti</h1>
      <p className="mt-3 max-w-md text-muted">
        Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="mt-8">
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  );
}
