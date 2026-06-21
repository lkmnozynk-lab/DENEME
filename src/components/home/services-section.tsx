import Link from "next/link";
import { ArrowUpRight, PenLine, AlignLeft, Palette } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { services } from "@/lib/site-config";

const icons = {
  EDITORLUK: PenLine,
  DIZGI: AlignLeft,
  KAPAK_TASARIMI: Palette,
} as const;

export function ServicesSection() {
  return (
    <section id="hizmetler" className="container-page py-20 lg:py-28">
      <SectionHeading
        eyebrow="Hizmetler"
        title="Eserinizi yayına hazırlayan üç temel uzmanlık"
        description="Fikirden basıma uzanan yolda, kitabınızın her aşamasını profesyonel bir titizlikle ele alıyoruz."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => {
          const Icon = icons[service.key];
          return (
            <Reveal key={service.slug} index={i}>
              <Link
                href={`/hizmetler/${service.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
              >
                <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-soft opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 flex items-center justify-between text-xl font-semibold">
                  {service.title}
                  <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <span className="mt-6 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Detayları gör →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
