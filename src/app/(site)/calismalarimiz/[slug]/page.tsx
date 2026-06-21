import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, User } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { CoverZoom, GalleryLightbox } from "@/components/work/work-media";
import { getWorkBySlug, getWorkSlugs } from "@/lib/content";
import { serviceTypeLabels } from "@/lib/site-config";

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "Çalışma bulunamadı" };
  return {
    title: work.title,
    description: work.description,
    alternates: { canonical: `/calismalarimiz/${work.slug}` },
    openGraph: {
      title: `${work.title} · NERAAJANS`,
      description: work.description,
      images: work.coverImage ? [{ url: work.coverImage }] : undefined,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Çalışma"
        title={work.title}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Çalışmalarımız", href: "/calismalarimiz" },
          { label: work.title },
        ]}
      />

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Cover */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl shadow-lift">
              <CoverZoom src={work.coverImage} title={work.title} />
            </div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal index={1}>
              <h2 className="text-2xl font-semibold">Proje Hakkında</h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {work.description}
              </p>
            </Reveal>

            <Reveal index={2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {work.year && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted">Yıl</p>
                      <p className="font-medium">{work.year}</p>
                    </div>
                  </div>
                )}
                {work.client && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted">Müşteri</p>
                      <p className="font-medium">{work.client}</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal index={3}>
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Verilen Hizmetler
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {work.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-primary"
                    >
                      {serviceTypeLabels[s] ?? s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal index={4}>
              <div className="mt-10">
                <ButtonLink href="/teklif-al">
                  Benzer Bir Proje Başlat
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Gallery */}
        {work.images.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold">Galeri</h2>
            <p className="mt-1 text-sm text-muted">
              Büyütmek için bir görsele tıklayın.
            </p>
            <div className="mt-6">
              <GalleryLightbox
                images={work.images.map((img) => ({
                  url: img.url,
                  alt: img.alt ?? work.title,
                }))}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
