import { putFile } from "@/lib/storage";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type ImageUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function sniffImage(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "gif";
  // WEBP: "RIFF"...."WEBP"
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) return "webp";
  return null;
}

/** Validates and stores an uploaded image to /public/uploads. */
export async function saveImageUpload(file: File): Promise<ImageUploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "Görsel bulunamadı." };
  if (file.size > MAX_IMAGE_BYTES)
    return { ok: false, error: "Görsel boyutu 5 MB sınırını aşıyor." };

  const ext = ALLOWED[file.type];
  if (!ext) return { ok: false, error: "Yalnızca JPG, PNG, WEBP ve GIF kabul edilir." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const sig = sniffImage(buffer.subarray(0, 12));
  const consistent =
    (ext === "jpg" && sig === "jpg") ||
    (ext === "png" && sig === "png") ||
    (ext === "gif" && sig === "gif") ||
    (ext === "webp" && sig === "webp");
  if (!consistent) return { ok: false, error: "Görsel içeriği beyan edilen türle uyuşmuyor." };

  const { url } = await putFile(buffer, ext, file.type);
  return { ok: true, url };
}
