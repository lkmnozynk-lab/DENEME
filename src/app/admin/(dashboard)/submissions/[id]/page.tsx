import Link from "next/link";
import { notFound } from "next/navigation";
import { access } from "fs/promises";
import path from "path";
import { ArrowLeft, Download, FileX2, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { updateSubmissionStatus, deleteSubmission } from "@/app/actions/submissions";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateTR } from "@/lib/utils";
import { serviceTypeLabels, submissionStatusLabels as statusLabels } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "IN_REVIEW", "CONTACTED", "ARCHIVED"] as const;

/**
 * Resolves a stored fileUrl into a usable download href and reports whether the
 * file is actually retrievable. Handles three cases:
 *  - Vercel Blob (absolute URL): assumed present, served from the CDN.
 *  - Local uploads (current `/api/uploads/<key>` or legacy `/uploads/<key>`):
 *    normalized to the `/api/uploads` route and existence-checked on disk, so
 *    submissions whose files were removed show a clear message instead of a
 *    broken download link.
 */
async function resolveAttachment(
  fileUrl: string,
): Promise<{ href: string; exists: boolean }> {
  if (/^https?:\/\//i.test(fileUrl)) {
    return { href: fileUrl, exists: true };
  }
  const key = fileUrl.split("/").pop() ?? "";
  // Newer quote attachments live in the auth-gated /api/attachments route +
  // /public/uploads/attachments folder; legacy ones used the public route.
  const isAttachment = fileUrl.includes("/attachments/");
  const href = isAttachment ? `/api/attachments/${key}` : `/api/uploads/${key}`;
  const diskPath = isAttachment
    ? path.join(process.cwd(), "public", "uploads", "attachments", key)
    : path.join(process.cwd(), "public", "uploads", key);
  try {
    await access(diskPath);
    return { href, exists: true };
  } catch {
    return { href, exists: false };
  }
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const s = await prisma.contactSubmission.findUnique({ where: { id } }).catch(() => null);
  if (!s) notFound();

  const attachment = s.fileUrl ? await resolveAttachment(s.fileUrl) : null;

  return (
    <>
      <Link
        href="/admin/submissions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm teklifler
      </Link>

      <AdminPageHeader
        title={s.name}
        description={`Gönderim tarihi: ${formatDateTR(s.createdAt)}`}
        actions={<DeleteButton action={deleteSubmission} id={s.id} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${s.email}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {s.email}
            </a>
            {s.phone && (
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4" />
                {s.phone}
              </span>
            )}
          </div>

          {s.serviceType && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Hizmet Türü
              </p>
              <p className="mt-1">{serviceTypeLabels[s.serviceType]}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Mesaj</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{s.message}</p>
          </div>

          {attachment && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Ek Dosya</p>
              {attachment.exists ? (
                <a
                  href={attachment.href}
                  download={s.fileName ?? true}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                  Dosyayı indir
                </a>
              ) : (
                <p className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/5 px-4 py-2.5 text-sm text-muted">
                  <FileX2 className="h-4 w-4" />
                  Dosya artık sunucuda bulunmuyor (kaldırılmış).
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">Durum</h2>
          <p className="text-sm text-muted">
            Mevcut durum: <span className="font-medium text-foreground">{statusLabels[s.status]}</span>
          </p>
          <form action={updateSubmissionStatus} className="space-y-3">
            <input type="hidden" name="id" value={s.id} />
            <select
              name="status"
              defaultValue={s.status}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {statusLabels[st]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-105"
            >
              Durumu Güncelle
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
