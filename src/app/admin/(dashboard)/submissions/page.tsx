import Link from "next/link";
import { ArrowRight, Paperclip } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { formatDateTR, cn } from "@/lib/utils";
import {
  serviceTypeLabels,
  submissionStatusLabels as statusLabels,
  submissionStatusStyles as statusStyles,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

async function getSubmissions() {
  try {
    return await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return null;
  }
}

export default async function AdminSubmissionsPage() {
  await requireUser();
  const submissions = await getSubmissions();

  return (
    <>
      <AdminPageHeader
        title="Teklifler"
        description="Gelen teklif ve iletişim taleplerini görüntüleyin."
      />

      {submissions === null ? (
        <Card>
          <p className="text-sm text-danger">Veritabanına ulaşılamadı.</p>
        </Card>
      ) : submissions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Henüz teklif talebi yok.</p>
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {submissions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/submissions/${s.id}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{s.name}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusStyles[s.status],
                        )}
                      >
                        {statusLabels[s.status]}
                      </span>
                      {s.fileUrl && <Paperclip className="h-3.5 w-3.5 text-muted" />}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {s.email}
                      {s.serviceType && ` · ${serviceTypeLabels[s.serviceType]}`}
                      {` · ${formatDateTR(s.createdAt)}`}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
