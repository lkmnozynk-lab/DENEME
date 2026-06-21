import Link from "next/link";
import { Plus, Pencil, Tags } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { deletePost } from "@/app/actions/blog";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    });
  } catch {
    return null;
  }
}

export default async function AdminBlogPage() {
  await requireUser();
  const posts = await getPosts();

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Blog yazılarınızı oluşturun ve yönetin."
        actions={
          <>
            <Link
              href="/admin/blog/categories"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Tags className="h-4 w-4" />
              Kategoriler
            </Link>
            <Link
              href="/admin/blog/new"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-105"
            >
              <Plus className="h-4 w-4" />
              Yeni Yazı
            </Link>
          </>
        }
      />

      {posts === null ? (
        <Card>
          <p className="text-sm text-danger">Veritabanına ulaşılamadı.</p>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Henüz yazı yok. “Yeni Yazı” ile başlayın.</p>
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{p.title}</p>
                    {p.published ? (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
                        Yayında
                      </span>
                    ) : (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                        Taslak
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.category?.name ?? "Kategorisiz"} · {formatDateTR(p.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                    Düzenle
                  </Link>
                  <DeleteButton action={deletePost} id={p.id} iconOnly />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
