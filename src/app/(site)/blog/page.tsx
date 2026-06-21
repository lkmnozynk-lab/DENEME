import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BookCover } from "@/components/ui/book-cover";
import { getAllPosts } from "@/lib/content";
import { blogCategories } from "@/lib/site-config";
import { formatDateTR, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Editörlük, dizgi, kapak tasarımı ve yayıncılık üzerine ipuçları, rehberler ve sektör notları.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const active = kategori ?? null;
  const posts = await getAllPosts(active ?? undefined);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Yayıncılık üzerine notlar"
        description="Editörlük, dizgi ve kapak tasarımı dünyasından ipuçları ve rehberler."
        breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Blog" }]}
      />

      <section className="container-page py-12 lg:py-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted hover:text-foreground",
            )}
          >
            Tümü
          </Link>
          {blogCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog?kategori=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="mt-16 text-center text-muted">
            Bu kategoride henüz yazı bulunmuyor.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} index={i % 3}>
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
                    <h2 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
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
        )}
      </section>
    </>
  );
}
