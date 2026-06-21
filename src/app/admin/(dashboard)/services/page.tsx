import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { serviceTypeLabels } from "@/lib/site-config";

export const dynamic = "force-dynamic";

async function getServices() {
  try {
    return await prisma.servicePage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminServicesPage() {
  await requireUser();
  const servicePages = await getServices();

  return (
    <>
      <AdminPageHeader
        title="Hizmetler"
        description="Her hizmetin detay sayfasını (giriş, kapsam, süreç, SSS) düzenleyin."
      />

      {servicePages.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Hizmet kaydı bulunamadı. `npm run db:seed` komutunu çalıştırarak
            varsayılan hizmetleri oluşturabilirsiniz.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {servicePages.map((s) => (
            <Link
              key={s.id}
              href={`/admin/services/${s.id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="min-w-0">
                <p className="mb-1 inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                  {serviceTypeLabels[s.key] ?? s.key}
                </p>
                <h2 className="truncate font-semibold group-hover:text-primary">{s.title}</h2>
                <p className="mt-0.5 truncate text-sm text-muted">{s.shortDescription}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted group-hover:text-primary">
                <Pencil className="h-4 w-4" />
                Düzenle
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
