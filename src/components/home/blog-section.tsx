import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import { getRecentPosts } from "@/lib/content";
import { formatDateTR } from "@/lib/utils";

export async function BlogSection() {
  const posts = await getRecentPosts(3);

  return (
    <section id="blog" className="container-page py-20 lg:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Blog"
          title="Yayıncılık üzerine notlar"
          description="Editörlük, dizgi ve kapak tasarımı dünyasından ipuçları ve rehberler."
        />
        <Reveal>
          <ButtonLink href="/blog" variant="outline" className="shrink-0">
            Tüm Yazılar
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} index={i}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <BookCover
                src={post.coverImage}
                title={post.title}
                index={i}
                ratio="aspect-[16/10]"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-muted">
                  {post.category && (
                    <span className="rounded-full bg-secondary-soft px-2.5 py-1 font-medium text-secondary">
                      {post.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} dk
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                )}
                {post.publishedAt && (
                  <span className="mt-4 text-xs text-muted">
                    {formatDateTR(post.publishedAt)}
                  </span>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
