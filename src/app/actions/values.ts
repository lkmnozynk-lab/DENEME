"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";

export type ValueState = { ok: boolean; message: string };

const schema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter olmalı.").max(120),
  description: z.string().trim().min(5, "Açıklama en az 5 karakter olmalı.").max(600),
  icon: z.string().trim().min(1).max(40),
});

function revalidate() {
  revalidatePath("/");
  revalidatePath("/hakkimizda");
  revalidatePath("/admin/pages");
}

export async function createValueItem(
  _prev: ValueState,
  formData: FormData,
): Promise<ValueState> {
  const user = await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  try {
    const count = await prisma.valueItem.count();
    const item = await prisma.valueItem.create({
      data: { ...parsed.data, order: count },
    });
    await logAudit({ userId: user.id, action: "create", entity: "ValueItem", entityId: item.id });
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
  revalidate();
  return { ok: true, message: "İlke eklendi." };
}

export async function updateValueItem(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!id || !parsed.success) return;
  try {
    await prisma.valueItem.update({ where: { id }, data: parsed.data });
    await logAudit({ userId: user.id, action: "update", entity: "ValueItem", entityId: id });
    await setFlash("success", "İlke güncellendi.");
  } catch {
    await setFlash("error", "Güncellenemedi.");
  }
  revalidate();
}

export async function deleteValueItem(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.valueItem.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "ValueItem", entityId: id });
    await setFlash("success", "İlke silindi.");
  } catch {
    await setFlash("error", "Silinemedi.");
  }
  revalidate();
}
