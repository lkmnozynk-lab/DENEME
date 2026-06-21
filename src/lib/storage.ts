import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Storage abstraction.
 *  - Production (Vercel): if BLOB_READ_WRITE_TOKEN is set, upload to Vercel Blob
 *    (durable, works on read-only serverless filesystems).
 *  - Local/dev: write to /public/uploads and serve from the app.
 *
 * Callers validate file type/size/signature BEFORE handing the buffer here.
 */
export async function putFile(
  buffer: Buffer,
  ext: string,
  contentType: string,
  opts?: { folder?: "attachments" },
): Promise<{ url: string }> {
  const key = `${randomUUID()}.${ext}`;
  // `attachments` are quote-form uploads — stored in a separate folder and
  // served only through the auth-gated /api/attachments route, so visitors
  // can't fetch other users' submitted files. Public images use /api/uploads.
  const isAttachment = opts?.folder === "attachments";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Lazy import so local/dev builds never require the dependency at runtime.
    const { put } = await import("@vercel/blob");
    const blob = await put(`${isAttachment ? "attachments" : "uploads"}/${key}`, buffer, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    // NOTE: Vercel Blob URLs are public even for attachments; tightening that
    // (private blobs / signed URLs) is a separate production hardening step.
    return { url: blob.url };
  }

  const dir = path.join(process.cwd(), "public", "uploads", ...(isAttachment ? ["attachments"] : []));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), buffer);
  // Served by a route handler (next start does not serve runtime files added to
  // /public). Attachments go through the auth-gated route.
  return { url: `${isAttachment ? "/api/attachments" : "/api/uploads"}/${key}` };
}
