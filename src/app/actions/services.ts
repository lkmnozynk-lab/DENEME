"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/audit";

export type ActionState = { ok: boolean; message: string };

const featureSchema = z.object({
  title: z.string().trim().min(1, "Özellik başlığı boş olamaz.").max(120),
  text: z.string().trim().min(1, "Özellik açıklaması boş olamaz.").max(600),
});
const stepSchema = z.object({
  step: z.string().trim().max(8).optional().default(""),
  title: z.string().trim().min(1, "Adım başlığı boş olamaz.").max(120),
  text: z.string().trim().min(1, "Adım açıklaması boş olamaz.").max(600),
});
const faqSchema = z.object({
  q: z.string().trim().min(1, "Soru boş olamaz.").max(300),
  a: z.string().trim().min(1, "Cevap boş olamaz.").max(1500),
});

/** Parses a JSON array field from FormData, returning [] on absence. */
function jsonArray(formData: FormData, name: string): unknown {
  const raw = formData.get(name);
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return null; // signals malformed input
  }
}

const baseSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Başlık boş olamaz.").max(120),
  shortDescription: z.string().trim().min(3, "Kısa açıklama çok kısa.").max(1000),
  tagline: z.string().trim().max(160).optional().default(""),
  intro: z.string().trim().max(2000).optional().default(""),
});

export async function updateServiceContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const base = baseSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    tagline: formData.get("tagline") ?? "",
    intro: formData.get("intro") ?? "",
  });
  if (!base.success) {
    return { ok: false, message: base.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const rawFeatures = jsonArray(formData, "features");
  const rawProcess = jsonArray(formData, "process");
  const rawFaqs = jsonArray(formData, "faqs");
  if (rawFeatures === null || rawProcess === null || rawFaqs === null) {
    return { ok: false, message: "Liste verisi okunamadı, sayfayı yenileyin." };
  }

  const features = z.array(featureSchema).safeParse(rawFeatures);
  const process = z.array(stepSchema).safeParse(rawProcess);
  const faqs = z.array(faqSchema).safeParse(rawFaqs);
  if (!features.success || !process.success || !faqs.success) {
    const err =
      features.error?.issues[0]?.message ??
      process.error?.issues[0]?.message ??
      faqs.error?.issues[0]?.message ??
      "Liste alanlarını kontrol edin.";
    return { ok: false, message: err };
  }

  // Auto-number process steps (01, 02, …) so the admin doesn't have to.
  const numberedProcess = process.data.map((p, i) => ({
    ...p,
    step: p.step || String(i + 1).padStart(2, "0"),
  }));

  try {
    const row = await prisma.servicePage.update({
      where: { id: base.data.id },
      data: {
        title: base.data.title,
        shortDescription: base.data.shortDescription,
        tagline: base.data.tagline || null,
        intro: base.data.intro || null,
        features: JSON.stringify(features.data),
        process: JSON.stringify(numberedProcess),
        faqs: JSON.stringify(faqs.data),
      },
    });
    await logAudit({
      userId: user.id,
      action: "update",
      entity: "ServicePage",
      entityId: base.data.id,
    });
    revalidatePath("/");
    revalidatePath("/hizmetler");
    revalidatePath(`/hizmetler/${row.slug}`);
    return { ok: true, message: "Hizmet içeriği güncellendi." };
  } catch {
    return { ok: false, message: "Kaydedilemedi. Veritabanı bağlantısını kontrol edin." };
  }
}
