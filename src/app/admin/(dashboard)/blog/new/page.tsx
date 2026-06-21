import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createPost } from "@/app/actions/blog";
import { AdminPageHeader } from "@/components/admin/ui";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    return await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  } catch {
    return [];
  }
}

export default async function NewPostPage() {
  await requireUser();
  const categories = await getCategories();
  return (
    <>
      <AdminPageHeader title="Yeni Yazı" description="Yeni bir blog yazısı oluşturun." />
      <BlogForm action={createPost} categories={categories} />
    </>
  );
}
