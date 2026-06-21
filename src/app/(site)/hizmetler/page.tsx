import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, PenLine, AlignLeft, Palette } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { getAllServiceDetails } from "@/lib/services";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Editörlük, dizgi ve kapak tasarımı. Eserinizi fikirden basıma uzanan yolda profesyonel bir titizlikle yayına hazırlıyoruz.",
  alternates: { canonical: "/hizmetler" },
};

// Admin-editable; render per request so edits show immediately.
export const dynamic = "force-dynamic";

const icons: Record<string, typeof PenLine> = {
  EDITORLUK: PenLine,
  DIZGI: AlignLeft,
  KAPAK_TASARIMI: Palette,
};

export default async function HizmetlerPage() {
  const serviceDetails = await getAllServiceDetails();
  return (
    <>
      <PageHeader
        eyebrow="Hizmetler"
        title="Eserinizi yayına hazırlayan uzmanlıklar"
        description="Üç temel hizmetimizle, kitabınızın her aşamasını profesyonel bir özenle ele alıyoruz."
        breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {serviceDetails.map((service, i) => {
            const Icon = icons[service.key] ?? PenLine;
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
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted">
                    {service.tagline}
                  </p>
                  <h2 className="mt-1 flex items-center justify-between text-xl font-semibold">
                    {service.title}
                    <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </h2>
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
    </>
  );
}
