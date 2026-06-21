"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";

export type WhyState = { ok: boolean; message: string };

const schema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter olmalı.").max(120),
  description: z.string().trim().min(5, "Açıklama en az 5 karakter olmalı.").max(600),
  icon: z.string().trim().min(1).max(40),
});

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/pages");
}

export async function createWhyReason(
  _prev: WhyState,
  formData: FormData,
): Promise<WhyState> {
  const user = await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  try {
    const count = await prisma.whyReason.count();
    const item = await prisma.whyReason.create({ data: { ...parsed.data, order: count } });
    await logAudit({ userId: user.id, action: "create", entity: "WhyReason", entityId: item.id });
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
  revalidate();
  return { ok: true, message: "Sebep eklendi." };
}

export async function updateWhyReason(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!id || !parsed.success) return;
  try {
    await prisma.whyReason.update({ where: { id }, data: parsed.data });
    await logAudit({ userId: user.id, action: "update", entity: "WhyReason", entityId: id });
    await setFlash("success", "Sebep güncellendi.");
  } catch {
    await setFlash("error", "Güncellenemedi.");
  }
  revalidate();
}

export async function deleteWhyReason(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.whyReason.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "WhyReason", entityId: id });
    await setFlash("success", "Sebep silindi.");
  } catch {
    await setFlash("error", "Silinemedi.");
  }
  revalidate();
}
