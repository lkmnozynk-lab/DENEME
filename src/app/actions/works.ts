"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import { slugify } from "@/lib/utils";

export type WorkFormState = { ok: boolean; message: string };

const workSchema = z.object({
  title: z.string().trim().min(2, "Başlık gerekli.").max(200),
  description: z.string().trim().min(10, "Açıklama en az 10 karakter olmalı.").max(4000),
  coverImage: z.string().trim().optional(),
  client: z.string().trim().max(160).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal(NaN)),
  services: z
    .array(z.enum(["EDITORLUK", "DIZGI", "KAPAK_TASARIMI"]))
    .default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

function parseForm(formData: FormData) {
  const yearRaw = formData.get("year");
  return workSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage") ?? "",
    client: formData.get("client") ?? "",
    year: yearRaw ? Number(yearRaw) : undefined,
    services: formData.getAll("services"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    order: formData.get("order") ?? 0,
  });
}

/** Generate a slug unique among works (ignoring `excludeId`). */
async function uniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "calisma";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.work.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createWork(
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const d = parsed.data;
  try {
    const slug = await uniqueSlug(d.title);
    const work = await prisma.work.create({
      data: {
        title: d.title,
        slug,
        description: d.description,
        coverImage: d.coverImage || null,
        client: d.client || null,
        year: Number.isNaN(d.year) ? null : (d.year ?? null),
        services: JSON.stringify(d.services),
        featured: d.featured,
        published: d.published,
        order: d.order,
      },
    });
    await logAudit({ userId: user.id, action: "create", entity: "Work", entityId: work.id });
  } catch {
    return { ok: false, message: "Kaydedilemedi. Veritabanını kontrol edin." };
  }
  revalidatePath("/");
  revalidatePath("/calismalarimiz");
  await setFlash("success", "Çalışma eklendi.");
  redirect("/admin/works");
}

export async function updateWork(
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Kayıt bulunamadı." };
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const d = parsed.data;
  try {
    const slug = await uniqueSlug(d.title, id);
    await prisma.work.update({
      where: { id },
      data: {
        title: d.title,
        slug,
        description: d.description,
        coverImage: d.coverImage || null,
        client: d.client || null,
        year: Number.isNaN(d.year) ? null : (d.year ?? null),
        services: JSON.stringify(d.services),
        featured: d.featured,
        published: d.published,
        order: d.order,
      },
    });
    await logAudit({ userId: user.id, action: "update", entity: "Work", entityId: id });
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
  revalidatePath("/");
  revalidatePath("/calismalarimiz");
  revalidatePath(`/calismalarimiz/${id}`);
  await setFlash("success", "Çalışma güncellendi.");
  redirect("/admin/works");
}

// ── Gallery (WorkImage) management ──

export async function addWorkImage(formData: FormData) {
  const user = await requireUser();
  const workId = String(formData.get("workId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  if (!workId || !url) return;
  try {
    const count = await prisma.workImage.count({ where: { workId } });
    await prisma.workImage.create({
      data: { workId, url, alt: alt || null, order: count },
    });
    await logAudit({ userId: user.id, action: "create", entity: "WorkImage", entityId: workId });
  } catch {
    // ignore
  }
  revalidatePath(`/admin/works/${workId}`);
  revalidatePath("/calismalarimiz");
}

export async function deleteWorkImage(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const workId = String(formData.get("workId") ?? "");
  if (!id) return;
  try {
    await prisma.workImage.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "WorkImage", entityId: id });
  } catch {
    // ignore
  }
  if (workId) revalidatePath(`/admin/works/${workId}`);
  revalidatePath("/calismalarimiz");
}

export async function deleteWork(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.work.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "Work", entityId: id });
  } catch {
    // ignore — record may already be gone
  }
  revalidatePath("/");
  revalidatePath("/calismalarimiz");
  await setFlash("success", "Çalışma silindi.");
  redirect("/admin/works");
}
