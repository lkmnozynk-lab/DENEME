import { readFile } from "fs/promises";
import path from "path";

/**
 * Serves files saved to /public/uploads at runtime.
 *
 * Next.js `next start` (production) only serves files that existed in /public
 * at BUILD time — files uploaded at runtime return 404. This route reads them
 * from disk and streams them with the correct content type, so quote-form
 * downloads and admin-uploaded images work in production.
 *
 * (When Vercel Blob is configured, files are served from the Blob CDN and this
 * route is not used.)
 */
const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  // Reject anything but a plain filename (no traversal, no slashes).
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(dir, name);

  // Defence-in-depth: ensure the resolved path stays inside the uploads dir.
  if (!path.resolve(filePath).startsWith(path.resolve(dir) + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
