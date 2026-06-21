"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";

export type AccountState = { ok: boolean; message: string };

const schema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifrenizi girin."),
    newPassword: z
      .string()
      .min(6, "Yeni şifre en az 6 karakter olmalı.")
      .max(100, "Şifre çok uzun."),
    confirmPassword: z.string().min(1, "Yeni şifreyi tekrar girin."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Yeni şifreler eşleşmiyor.",
  });

export async function changePassword(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const sessionUser = await requireUser();

  const parsed = schema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user?.passwordHash) {
      return { ok: false, message: "Kullanıcı bulunamadı." };
    }

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return { ok: false, message: "Mevcut şifre hatalı." };
    }

    // Reject reusing the same password.
    const same = await bcrypt.compare(parsed.data.newPassword, user.passwordHash);
    if (same) {
      return { ok: false, message: "Yeni şifre mevcut şifreyle aynı olamaz." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await logAudit({ userId: user.id, action: "change-password", entity: "User", entityId: user.id });

    return { ok: true, message: "Şifreniz başarıyla güncellendi." };
  } catch {
    return { ok: false, message: "Şifre güncellenemedi. Lütfen tekrar deneyin." };
  }
}
