"use server";

import { requireUser } from "@/lib/auth-helpers";
import { saveImageUpload, type ImageUploadResult } from "@/lib/upload-image";

/** Admin-only image upload, called from client image fields. */
export async function uploadImage(formData: FormData): Promise<ImageUploadResult> {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Görsel bulunamadı." };
  return saveImageUpload(file);
}
