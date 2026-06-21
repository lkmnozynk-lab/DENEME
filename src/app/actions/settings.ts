"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";

export type ActionState = { ok: boolean; message: string };

const optionalUrl = z
  .string()
  .trim()
  .url("Geçerli bir URL girin.")
  .or(z.literal(""))
  .optional();

// ── Pages: Hero + About ──
const contentSchema = z.object({
  heroHeadline: z.string().trim().min(3).max(200),
  heroSubheadline: z.string().trim().min(3).max(800),
  aboutTitle: z.string().trim().min(3).max(200),
  aboutContent: z.string().trim().min(3).max(4000),
});

export async function updateSiteContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = contentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  try {
    await prisma.siteSettings.update({ where: { id: "singleton" }, data: parsed.data });
    await logAudit({ userId: user.id, action: "update", entity: "SiteContent" });
    revalidatePath("/");
    revalidatePath("/hakkimizda");
    return { ok: true, message: "Sayfa içeriği güncellendi." };
  } catch {
    return { ok: false, message: "Kaydedilemedi. Veritabanı bağlantısını kontrol edin." };
  }
}

// ── Site settings: brand + social ──
const siteSchema = z.object({
  brandName: z.string().trim().min(1).max(120),
  slogan: z.string().trim().min(1).max(300),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  xUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
});

export async function updateSiteSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = siteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const data = parsed.data;
  try {
    await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: {
        brandName: data.brandName,
        slogan: data.slogan,
        instagramUrl: data.instagramUrl || null,
        facebookUrl: data.facebookUrl || null,
        xUrl: data.xUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        youtubeUrl: data.youtubeUrl || null,
      },
    });
    await logAudit({ userId: user.id, action: "update", entity: "SiteSettings" });
    revalidatePath("/");
    revalidatePath("/iletisim");
    return { ok: true, message: "Site ayarları güncellendi." };
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
}

// ── SEO settings ──
const seoSchema = z.object({
  defaultTitle: z.string().trim().min(1).max(200),
  titleTemplate: z.string().trim().min(1).max(120),
  defaultDescription: z.string().trim().min(1).max(400),
  keywords: z.string().trim().max(400).optional(),
});

export async function updateSEOSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = seoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  try {
    await prisma.sEOSettings.update({
      where: { id: "singleton" },
      data: { ...parsed.data, keywords: parsed.data.keywords || null },
    });
    await logAudit({ userId: user.id, action: "update", entity: "SEOSettings" });
    revalidatePath("/", "layout");
    return { ok: true, message: "SEO ayarları güncellendi." };
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
}

// ── Service page edit ──
const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  shortDescription: z.string().trim().min(3).max(1000),
});

export async function updateService(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  try {
    await prisma.servicePage.update({
      where: { id: parsed.data.id },
      data: { title: parsed.data.title, shortDescription: parsed.data.shortDescription },
    });
    await logAudit({ userId: user.id, action: "update", entity: "ServicePage", entityId: parsed.data.id });
    revalidatePath("/");
    revalidatePath("/hizmetler");
    return { ok: true, message: "Hizmet güncellendi." };
  } catch {
    return { ok: false, message: "Kaydedilemedi." };
  }
}
