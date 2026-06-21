import { ALLOWED_UPLOAD_MIME, MAX_UPLOAD_BYTES } from "@/lib/validation";
import { putFile } from "@/lib/storage";

export type UploadResult =
  | { ok: true; url: string; fileName: string }
  | { ok: false; error: string };

/** Magic-byte signatures for the formats we accept (defence-in-depth). */
function sniffSignature(bytes: Uint8Array): "pdf" | "zip" | "doc" | null {
  // PDF: %PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)
    return "pdf";
  // ZIP / DOCX (DOCX is a zip): PK\x03\x04
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04)
    return "zip";
  // Legacy DOC (OLE2): D0 CF 11 E0
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0)
    return "doc";
  return null;
}

/**
 * Validates and stores an uploaded file via the storage layer (Vercel Blob in
 * production, local disk in dev). Enforces allow-listed MIME, a size cap, and
 * magic-byte verification. Filenames are randomized to prevent traversal.
 */
export async function saveUpload(file: File): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "Dosya bulunamadı." };

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Dosya boyutu 10 MB sınırını aşıyor." };
  }

  const ext = ALLOWED_UPLOAD_MIME[file.type];
  if (!ext) {
    return {
      ok: false,
      error: "Yalnızca PDF, DOC, DOCX ve ZIP dosyaları kabul edilir.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sig = sniffSignature(buffer.subarray(0, 4));
  // The declared type must be consistent with the actual file signature.
  const okBySig =
    (ext === "pdf" && sig === "pdf") ||
    (ext === "zip" && sig === "zip") ||
    (ext === "docx" && sig === "zip") ||
    (ext === "doc" && sig === "doc");
  if (!okBySig) {
    return { ok: false, error: "Dosya içeriği beyan edilen türle uyuşmuyor." };
  }

  // Quote attachments are stored privately (served only via the auth-gated
  // /api/attachments route), so they aren't publicly downloadable.
  const { url } = await putFile(buffer, ext, file.type, { folder: "attachments" });
  const fileName = url.split("/").pop() ?? `dosya.${ext}`;
  return { ok: true, url, fileName };
}
