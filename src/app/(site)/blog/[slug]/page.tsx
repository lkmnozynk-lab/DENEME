import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { BookCover } from "@/components/ui/book-cover";
import { ButtonLink } from "@/components/ui/button";
import { getPostBySlug, getPostSlugs, getAllPosts } from "@/lib/content";
import { formatDateTR } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · NERAAJANS`,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getAllPosts(post.categorySlug ?? undefined))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        eyebrow={post.category ?? "Blog"}
        title={post.title}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 text-sm text-muted">
            {post.category && (
              <span className="rounded-full bg-secondary-soft px-3 py-1 font-medium text-secondary">
                {post.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingMinutes} dk okuma
            </span>
            {post.publishedAt && <span>· {formatDateTR(post.publishedAt)}</span>}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl shadow-soft">
            <BookCover
              src={post.coverImage}
              title={post.title}
              index={1}
              ratio="aspect-[16/9]"
            />
          </div>

          {/* Content is authored via the admin (Tiptap) and sanitized on save. */}
          <div
            className="prose-content mt-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 border-t border-border pt-8">
            <ButtonLink href="/blog" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Tüm Yazılar
            </ButtonLink>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="text-2xl font-semibold">İlgili Yazılar</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <BookCover
                    src={r.coverImage}
                    title={r.title}
                    index={i}
                    ratio="aspect-[16/10]"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold leading-snug transition-colors group-hover:text-primary">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
