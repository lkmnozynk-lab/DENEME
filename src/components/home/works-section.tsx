import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import { getFeaturedWorks } from "@/lib/content";
import { serviceTypeLabels } from "@/lib/site-config";

export async function WorksSection() {
  const works = await getFeaturedWorks(3);

  return (
    <section id="calismalarimiz" className="container-page py-20 lg:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Çalışmalarımız"
          title="Sayfaya dönüşen hikâyeler"
          description="Birlikte çalıştığımız yazar ve yayınevlerinin eserlerinden bir seçki."
        />
        <Reveal>
          <ButtonLink href="/calismalarimiz" variant="outline" className="shrink-0">
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, i) => (
          <Reveal key={work.slug} index={i}>
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
                <h3 className="mt-4 text-lg font-semibold transition-colors group-hover:text-primary">
                  {work.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {work.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
