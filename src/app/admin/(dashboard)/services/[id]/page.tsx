import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { AdminPageHeader } from "@/components/admin/ui";
import {
  ServiceContentManager,
  type ServiceContent,
} from "@/components/admin/service-content-manager";
import { serviceTypeLabels } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function parseArr<T>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const p = JSON.parse(value);
    return Array.isArray(p) ? (p as T[]) : [];
  } catch {
    return [];
  }
}

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const s = await prisma.servicePage.findUnique({ where: { id } }).catch(() => null);
  if (!s) notFound();

  const service: ServiceContent = {
    id: s.id,
    key: s.key,
    title: s.title,
    shortDescription: s.shortDescription,
    tagline: s.tagline ?? "",
    intro: s.intro ?? "",
    features: parseArr(s.features),
    process: parseArr(s.process),
    faqs: parseArr(s.faqs),
  };

  return (
    <>
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm hizmetler
      </Link>

      <AdminPageHeader
        title={serviceTypeLabels[s.key] ?? s.title}
        description="Detay sayfasının tüm bölümlerini buradan düzenleyin."
        actions={
          <Link
            href={`/hizmetler/${s.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
            Sayfayı gör
          </Link>
        }
      />

      <ServiceContentManager service={service} />
    </>
  );
}
