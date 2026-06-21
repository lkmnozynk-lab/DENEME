import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { deleteWork } from "@/app/actions/works";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { serviceTypeLabels } from "@/lib/site-config";
import { parseServices } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getWorks() {
  try {
    return await prisma.work.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return null;
  }
}

export default async function AdminWorksPage() {
  await requireUser();
  const works = await getWorks();

  return (
    <>
      <AdminPageHeader
        title="Çalışmalarımız"
        description="Portföy çalışmalarınızı ekleyin, düzenleyin ve yönetin."
        actions={
          <Link
            href="/admin/works/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-105"
          >
            <Plus className="h-4 w-4" />
            Yeni Çalışma
          </Link>
        }
      />

      {works === null ? (
        <Card>
          <p className="text-sm text-danger">Veritabanına ulaşılamadı.</p>
        </Card>
      ) : works.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Henüz çalışma eklenmedi. “Yeni Çalışma” ile başlayın.
          </p>
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {works.map((w) => (
              <li
                key={w.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{w.title}</p>
                    {w.featured && <Star className="h-4 w-4 fill-primary text-primary" />}
                    {!w.published && (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                        Taslak
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 flex flex-wrap gap-1.5 text-xs text-muted">
                    {parseServices(w.services).map((s) => (
                      <span key={s}>{serviceTypeLabels[s] ?? s}</span>
                    ))}
                    {w.year && <span>· {w.year}</span>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/works/${w.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteWork} id={w.id} iconOnly />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
