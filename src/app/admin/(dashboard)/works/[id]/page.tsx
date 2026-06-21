import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { updateWork } from "@/app/actions/works";
import { AdminPageHeader } from "@/components/admin/ui";
import { WorkForm } from "@/components/admin/work-form";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { parseServices } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const work = await prisma.work
    .findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    })
    .catch(() => null);
  if (!work) notFound();

  return (
    <>
      <AdminPageHeader title="Çalışmayı Düzenle" description={work.title} />
      <WorkForm
        action={updateWork}
        values={{
          id: work.id,
          title: work.title,
          description: work.description,
          coverImage: work.coverImage,
          client: work.client,
          year: work.year,
          services: parseServices(work.services),
          featured: work.featured,
          published: work.published,
          order: work.order,
        }}
      />
      <div className="mt-6">
        <GalleryManager
          workId={work.id}
          images={work.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt }))}
        />
      </div>
    </>
  );
}
