import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BookCover } from "@/components/ui/book-cover";
import { getAllWorks } from "@/lib/content";
import { serviceTypeLabels } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Çalışmalarımız",
  description:
    "Birlikte çalıştığımız yazar ve yayınevlerinin eserlerinden bir seçki. Editörlük, dizgi ve kapak tasarımı projelerimiz.",
  alternates: { canonical: "/calismalarimiz" },
};

export default async function CalismalarimizPage() {
  const works = await getAllWorks();

  return (
    <>
      <PageHeader
        eyebrow="Çalışmalarımız"
        title="Sayfaya dönüşen hikâyeler"
        description="Editörlük, dizgi ve kapak tasarımı süreçlerinde emek verdiğimiz eserlerden bir seçki."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Çalışmalarımız" },
        ]}
      />

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work, i) => (
            <Reveal key={work.slug} index={i % 3}>
              <Link
                href={`/calismalarimiz/${work.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <BookCover
                  src={work.coverImage}
                  title={work.title}
                  index={i}
                  ratio="aspect-[4/3]"
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {work.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary"
                      >
                        {serviceTypeLabels[s] ?? s}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-4 flex items-center justify-between text-lg font-semibold transition-colors group-hover:text-primary">
                    {work.title}
                    {work.year && (
                      <span className="text-sm font-normal text-muted">
                        {work.year}
                      </span>
                    )}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {work.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
