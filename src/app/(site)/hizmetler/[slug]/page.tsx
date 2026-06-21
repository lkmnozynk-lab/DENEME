import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getServiceDetail, getAllServiceDetails } from "@/lib/services";

// Content is admin-editable; render per request so edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceDetail(slug);
  if (!service) return { title: "Hizmet bulunamadı" };
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/hizmetler/${service.slug}` },
    openGraph: { title: `${service.title} · NERAAJANS`, description: service.description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceDetail(slug);
  if (!service) notFound();

  const all = await getAllServiceDetails();
  const others = all.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader
        eyebrow={service.tagline}
        title={service.title}
        description={service.description}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hizmetler", href: "/hizmetler" },
          { label: service.title },
        ]}
      />

      {/* Intro */}
      {service.intro && (
        <section className="container-page py-16 lg:py-20">
          <Reveal>
            <p className="max-w-3xl font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              {service.intro}
            </p>
          </Reveal>
        </section>
      )}

      {/* Features */}
      {service.features.length > 0 && (
      <section className="bg-surface py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Neler Yapıyoruz" title="Bu hizmet kapsamında" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <Reveal key={f.title} index={i}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-background p-6 shadow-soft">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Process */}
      {service.process.length > 0 && (
      <section className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="Süreç" title="Nasıl çalışıyoruz?" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <Reveal key={p.step || i} index={i}>
              <div className="relative h-full rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <span className="font-display text-4xl font-semibold text-primary/25">
                  {p.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* FAQ */}
      {service.faqs.length > 0 && (
      <section className="bg-surface py-16 lg:py-24">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Sıkça Sorulanlar" title="Merak edilenler" />
          <div className="mt-10 space-y-4">
            {service.faqs.map((faq, i) => (
              <Reveal key={i} index={i}>
                <details className="group rounded-2xl border border-border bg-background p-6 shadow-soft">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {faq.q}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CTA + other services */}
      <section className="container-page py-16 lg:py-24">
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground shadow-lift sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {service.title} hizmetimizle ilgileniyor musunuz?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Projenizi paylaşın, size özel bir teklif hazırlayalım.
          </p>
          <div className="mt-8">
            <ButtonLink
              href="/teklif-al"
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              Teklif Al
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Diğer Hizmetler
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/hizmetler/${o.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted">{o.tagline}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
