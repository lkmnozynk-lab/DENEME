import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark className="h-14 w-14 text-primary" />
      <p className="mt-6 font-display text-6xl font-semibold text-foreground">404</p>
      <h1 className="mt-3 text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-3 max-w-md text-muted">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Ana sayfaya
        dönerek devam edebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Ana Sayfaya Dön</ButtonLink>
        <ButtonLink href="/iletisim" variant="outline">
          İletişime Geç
        </ButtonLink>
      </div>
    </div>
  );
}
