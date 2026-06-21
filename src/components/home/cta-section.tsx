import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="container-page py-12 lg:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground shadow-lift sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Eseriniz, hak ettiği profesyonel dokunuşu bekliyor.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85">
              Projenizi bizimle paylaşın; editörlük, dizgi ve kapak tasarımı
              ihtiyaçlarınız için size özel bir teklif hazırlayalım.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href="/teklif-al"
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Ücretsiz Teklif Al
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/hizmetler"
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
              >
                Hizmetleri İncele
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
