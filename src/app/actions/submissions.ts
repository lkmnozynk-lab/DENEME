"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";

export async function updateSubmissionStatus(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const statusParsed = z
    .enum(["NEW", "IN_REVIEW", "CONTACTED", "ARCHIVED"])
    .safeParse(formData.get("status"));
  if (!id || !statusParsed.success) return;
  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status: statusParsed.data },
    });
    await logAudit({
      userId: user.id,
      action: "update-status",
      entity: "ContactSubmission",
      entityId: id,
      meta: { status: statusParsed.data },
    });
    await setFlash("success", "Durum güncellendi.");
  } catch {
    await setFlash("error", "Durum güncellenemedi.");
  }
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
}

export async function deleteSubmission(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.contactSubmission.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "ContactSubmission", entityId: id });
  } catch {
    // ignore
  }
  revalidatePath("/admin/submissions");
  await setFlash("success", "Teklif silindi.");
  redirect("/admin/submissions");
}
