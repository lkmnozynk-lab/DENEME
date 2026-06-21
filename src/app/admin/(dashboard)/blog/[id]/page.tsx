import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { updatePost } from "@/app/actions/blog";
import { AdminPageHeader } from "@/components/admin/ui";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }).catch(() => null),
    prisma.blogCategory
      .findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
      .catch(() => []),
  ]);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title="Yazıyı Düzenle" description={post.title} />
      <BlogForm
        action={updatePost}
        categories={categories}
        values={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          categoryId: post.categoryId,
          published: post.published,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }}
      />
    </>
  );
}
