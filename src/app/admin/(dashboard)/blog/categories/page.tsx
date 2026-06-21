import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    const cats = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return cats.map((c) => ({ id: c.id, name: c.name, postCount: c._count.posts }));
  } catch {
    return null;
  }
}

export default async function CategoriesPage() {
  await requireUser();
  const categories = await getCategories();

  return (
    <>
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog
      </Link>
      <AdminPageHeader
        title="Blog Kategorileri"
        description="Blog kategorilerini oluşturun, yeniden adlandırın veya silin."
      />
      {categories === null ? (
        <Card>
          <p className="text-sm text-danger">Veritabanına ulaşılamadı.</p>
        </Card>
      ) : (
        <CategoryManager categories={categories} />
      )}
    </>
  );
}
