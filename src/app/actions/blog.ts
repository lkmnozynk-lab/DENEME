"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import { slugify } from "@/lib/utils";
import { sanitizeHtml, htmlToText, estimateReadingMinutes } from "@/lib/sanitize";

export type PostFormState = { ok: boolean; message: string };

const postSchema = z.object({
  title: z.string().trim().min(2, "Başlık gerekli.").max(220),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().trim().min(10, "İçerik en az 10 karakter olmalı."),
  coverImage: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  published: z.boolean().default(false),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(400).optional(),
});

function parseForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    published: formData.get("published") === "on",
    seoTitle: formData.get("seoTitle") ?? "",
    seoDescription: formData.get("seoDescription") ?? "",
  });
}

async function uniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "yazi";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const d = parsed.data;
  const content = sanitizeHtml(d.content);
  const excerpt = d.excerpt || htmlToText(content).slice(0, 180);

  try {
    const slug = await uniqueSlug(d.title);
    const post = await prisma.blogPost.create({
      data: {
        title: d.title,
        slug,
        excerpt,
        content,
        coverImage: d.coverImage || null,
        categoryId: d.categoryId || null,
        authorId: user.id,
        published: d.published,
        publishedAt: d.published ? new Date() : null,
        readingMinutes: estimateReadingMinutes(content),
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
      },
    });
    await logAudit({ userId: user.id, action: "create", entity: "BlogPost", entityId: post.id });
  } catch {
    return { ok: false, message: "Kaydedilemedi. Veritabanını kontrol edin." };
  }
  revalidatePath("/");
  revalidatePath("/blog");
  await setFlash("success", "Yazı eklendi.");
  redirect("/admin/blog");
}

export async function updatePost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Kayıt bulunamadı." };
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const d = parsed.data;
  const content = sanitizeHtml(d.content);
  const excerpt = d.excerpt || htmlToText(content).slice(0, 180);

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Kayıt bulunamadı." };
    const slug = await uniqueSlug(d.title, id);
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: d.title,
        slug,
        excerpt,
        content,
        coverImage: d.coverImage || null,
        categoryId: d.categoryId || null,
        published: d.published,
        // Set publishedAt the first time it goes live; keep it otherwise.
        publishedAt: d.published ? existing.publishedAt ?? new Date() : null,
        readingMinutes: estimateReadingMinutes(content),
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
      },
    });
    await logAudit({ userId: user.id, action: "update", entity: "BlogPost", entityId: id });
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
  revalidatePath("/");
  revalidatePath("/blog");
  await setFlash("success", "Yazı güncellendi.");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.blogPost.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "delete", entity: "BlogPost", entityId: id });
  } catch {
    // ignore
  }
  revalidatePath("/");
  revalidatePath("/blog");
  await setFlash("success", "Yazı silindi.");
  redirect("/admin/blog");
}
