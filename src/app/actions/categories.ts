"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export type CategoryState = { ok: boolean; message: string };

const nameSchema = z.string().trim().min(2, "Kategori adı en az 2 karakter olmalı.").max(80);

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "kategori";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createCategory(
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const user = await requireUser();
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  try {
    const slug = await uniqueSlug(parsed.data);
    const cat = await prisma.blogCategory.create({
      data: { name: parsed.data, slug },
    });
    await logAudit({ userId: user.id, action: "create", entity: "BlogCategory", entityId: cat.id });
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
  return { ok: true, message: "Kategori eklendi." };
}

export async function updateCategory(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!id || !parsed.success) return;
  try {
    const slug = await uniqueSlug(parsed.data, id);
    await prisma.blogCategory.update({
      where: { id },
      data: { name: parsed.data, slug },
    });
    await logAudit({ userId: user.id, action: "update", entity: "BlogCategory", entityId: id });
  } catch {
    // ignore
  }
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}

export async function deleteCategory(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    // Posts' categoryId is set to null via the schema's onDelete: SetNull.
    await prisma.blogCategory.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "BlogCategory", entityId: id });
  } catch {
    // ignore
  }
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}
